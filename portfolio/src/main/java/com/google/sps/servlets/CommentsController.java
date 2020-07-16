// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps.servlets;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.SortDirection;
import com.google.cloud.language.v1.Document;
import com.google.cloud.language.v1.LanguageServiceClient;
import com.google.gson.Gson;
import com.google.sps.common.DefaultParams;
import com.google.sps.common.SentimentScoreBoundaries;
import com.google.sps.models.Info;
import com.google.sps.models.Comment;
import com.google.sps.models.Comments;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

@WebServlet("/comments")
public class CommentsController extends HttpServlet {
  private final DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();

  private enum Sentiment {
    Happy, Neutral, Mad
  };

  /**
   * GET Method for /comments endpoint
   * It gets the list of comments from datastore 
   * filtered and ordered according to query params
   * 
   * The way it works is by requesting the whole list of comments
   * to datastore. Although this is probably not the most perfomant approach
   * there are no other options since datastore does not have functions to
   * retrieve the total of entities, or event skip the first N entities.
   * 
   * If an alternative is found, changes are welcome
   *
   * @param request object containing request headers and other information coming from client
   * @param response object containing response headers and other information going back to the client
   */
  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    response.setContentType("application/json;");

    // Parse parameters
    int page = parsePageParam(request.getParameter("page"));
    int pageSize = parsePageSizeParam(request.getParameter("pageSize"));
    SortDirection order = parseOrderParam(request.getParameter("order"));
    String orderBy = parseOrderByParam(request.getParameter("orderBy"));

    Query query = new Query("Comment").addSort(orderBy, order);
    PreparedQuery results = datastore.prepare(query);

    List<Comment> commentsList = new ArrayList<>();
    for (Entity entity : results.asIterable()) {
      long id = entity.getKey().getId();
      String username = (String) entity.getProperty("username");
      String comment = (String) entity.getProperty("comment");
      long createdAt = (long) entity.getProperty("createdAt");
      String sentiment = (String) entity.getProperty("sentiment");
      int likes = ((Long) entity.getProperty("likes")).intValue();

      commentsList.add(new Comment(id, username, comment, createdAt, likes, sentiment));
    }

    int count = commentsList.size();
    int pages = (int) Math.ceil((double) count / pageSize);
    Integer next = page < pages ? (page + 1) : null;
    Integer prev = page > 1 ? (page - 1) : null;

    Info info = new Info(next, prev, count, pages);
    int lowerIndex = (page - 1) * pageSize;
    int upperIndex = page * pageSize;
    List<Comment> trimmedComments = commentsList.subList(lowerIndex >= 0 ? lowerIndex : 0,
        upperIndex <= count ? upperIndex : count);

    Comments comments = new Comments(info, trimmedComments);
    Gson gson = new Gson();
    String data = gson.toJson(comments);

    response.getWriter().println(data);
  }

  /**
   * POST Method for /comments endpoint
   * It creates a new comment, passes through
   * sentiment analysis API and inserts the new comment in datastore
   * 
   * @param request object containing request headers and other information coming from client
   * @param response object containing response headers and other information going back to the client
   */
  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    response.setContentType("application/json;");

    String body = getBody(request);
    JSONObject json = new JSONObject();
    try {
      JSONParser parser = new JSONParser();
      json = (JSONObject) parser.parse(body);
    } catch (ParseException e) {
      e.printStackTrace();
    }

    String username = getAttribute(json, "username", "Anonymous");
    String comment = getAttribute(json, "comment", "...");
    long createdAt = System.currentTimeMillis();
    int likes = 0;
    Sentiment sentiment = analyzeSentiment(comment);

    Entity commentEntity = new Entity("Comment");
    commentEntity.setProperty("username", username);
    commentEntity.setProperty("comment", comment);
    commentEntity.setProperty("createdAt", createdAt);
    commentEntity.setProperty("likes", likes);
    commentEntity.setProperty("sentiment", sentiment.name());

    datastore.put(commentEntity);

    long id = commentEntity.getKey().getId();

    Gson gson = new Gson();
    String data = gson.toJson(new Comment(id, username, comment, createdAt, likes, sentiment.name()));

    response.getWriter().println(data);
  }

  /**
   * PUT Method for /comments endpoint
   * Used to increase comment likes counting.
   * This is done since any other field of the comment is editable
   * 
   * @param request object containing request headers and other information coming from client
   * @param response object containing response headers and other information going back to the client
   */
  @Override
  public void doPut(HttpServletRequest request, HttpServletResponse response) throws IOException {
    response.setContentType("application/json;");

    String body = getBody(request);
    JSONObject json = new JSONObject();

    try {
      JSONParser parser = new JSONParser();
      json = (JSONObject) parser.parse(body);
    } catch (ParseException e) {
      e.printStackTrace();
    }

    String id = getAttribute(json, "id", null);
    Key key = KeyFactory.createKey("Comment", Long.parseLong(id));

    Entity commentEntity;
    try {
      commentEntity = datastore.get(key);
    } catch (EntityNotFoundException e) {
      e.printStackTrace();
      return;
    }

    int likes = ((Long) commentEntity.getProperty("likes")).intValue();
    likes++;
    commentEntity.setProperty("likes", likes);

    datastore.put(commentEntity);

    String username = (String) commentEntity.getProperty("username");
    String comment = (String) commentEntity.getProperty("comment");
    long createdAt = (long) commentEntity.getProperty("createdAt");
    String sentiment = (String) commentEntity.getProperty("sentiment");

    Gson gson = new Gson();
    String data = gson
        .toJson(new Comment(commentEntity.getKey().getId(), username, comment, createdAt, likes, sentiment));

    response.getWriter().println(data);
  }

  /**
   * DELETE Method for /comments endpoint
   * Comment removal function. This deletes a comment
   * entity by its id from datastore
   * 
   * @param request object containing request headers and other information coming from client
   * @param response object containing response headers and other information going back to the client
   */
  @Override
  public void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {
    response.setContentType("application/json;");

    String body = getBody(request);
    JSONObject json = new JSONObject();

    try {
      JSONParser parser = new JSONParser();
      json = (JSONObject) parser.parse(body);
    } catch (ParseException e) {
      e.printStackTrace();
    }

    String id = getAttribute(json, "id", null);
    Key key = KeyFactory.createKey("Comment", Long.parseLong(id));

    datastore.delete(key);

    JSONObject obj = new JSONObject();
    obj.put("status", "ok");

    response.getWriter().println(obj.toString());
  }

  /**
   * Request Body Parser
   * This method is an auxiliar for any request containing a body,
   * so the context can access to it
   * 
   * @param request object from where the body will be read
   * @return JSON Stringified representation of request body
   */
  private String getBody(HttpServletRequest request) throws IOException {
    String method = request.getMethod();
    // Since GET method does not have a body, this prevents function to throw
    if (method != "GET") {
      Scanner scanner = new Scanner(request.getInputStream(), "UTF-8");
      scanner.useDelimiter("\\A");

      String body = "";

      if (scanner.hasNext()) {
        body = scanner.next();
      }

      scanner.close();

      return body;
    }

    return "";
  }

   /**
   * JSON Attribute getter
   * Allows to get an attribute out of a JSON object,
   * and a default value can be supplied to be returned
   * when attribute is null
   * 
   * @param json JSON object from where the attribute will be taken
   * @param attribute key of the attribute
   * @param defaultValue value to return if attribute is null
   * @return JSON Stringified representation of request body
   */
  private String getAttribute(JSONObject json, String attribute, String defaultValue) {
    String value = (String) json.get(attribute);
    if (value == null) {
      return defaultValue;
    }

    return value;
  }

  /**
   * Page param parser
   * This is a helper for GET method in /comments endpoint. 
   * It allows to set the page param sent by client. And, if not present,
   * it returns page 1 by default
   * 
   * @param page stringified page number taken from url params if present
   * @return page number to send to the client
   */
  private int parsePageParam(String page) {
    if (page != null)
      return Integer.parseInt(page);

    return DefaultParams.page;
  }

  private int parsePageSizeParam(String pageSize) {
    if (pageSize != null)
      return Integer.parseInt(pageSize);

    return DefaultParams.pageSize;
  }

  /**
   * Order param parser
   * This is a helper for GET method in /comments endpoint. 
   * It allows to set the order sent by client. And, if not present,
   * it returns DESCENDING by default
   * 
   * @param order stringified order taken from url params if present
   * @return order in which data will be sent to client
   */
  private SortDirection parseOrderParam(String order) {
    switch ((order != null) ? order : "") {
    case "asc":
      return SortDirection.ASCENDING;
    case "desc":
      return SortDirection.DESCENDING;
    default:
      return DefaultParams.order;
    }
  }

  /**
   * Order By param parser
   * This is a helper for GET method in /comments endpoint. 
   * It allows to set the order sent by client. And, if not present,
   * it returns createdAt by default
   * 
   * @param order stringified order taken from url params if present
   * @return attribute of Comment to order by
   */
  private String parseOrderByParam(String orderBy) {
    switch ((orderBy != null) ? orderBy : "") {
    case "createdAt":
      return "createdAt";
    case "likes":
      return "likes";
    default:
      return DefaultParams.orderBy;
    }
  }

  /**
   * Sentiment Analyzer
   * A method to analyze a score, result of Cloud Natural Language API
   * This score is classified in intervals to return a sentiment
   * 
   * @param comment The plaintext comment to analyze
   * @return Sentiment result from score classification
   */
  private Sentiment analyzeSentiment(String comment) throws IOException {
    try (LanguageServiceClient languageService = LanguageServiceClient.create()) {
      Document document = Document.newBuilder().setContent(comment).setType(Document.Type.PLAIN_TEXT).build();

      double score = (double) languageService.analyzeSentiment(document).getDocumentSentiment().getScore();

      // Scores are set to -1, -0.3, 0.3 and 1
      // in order to try to split the score spectrum
      // in the most general way possible
      // Different approaches could work if they
      // have enough justification
      if (score >= SentimentScoreBoundaries.lower && score <= SentimentScoreBoundaries.neutralLow)
        return Sentiment.Mad;
      if (score > SentimentScoreBoundaries.neutralLow && score <= SentimentScoreBoundaries.neutralHigh)
        return Sentiment.Neutral;
      else
        return Sentiment.Happy;
    }
  }
}
