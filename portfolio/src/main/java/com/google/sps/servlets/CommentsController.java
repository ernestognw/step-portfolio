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
import com.google.gson.Gson;
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
      int likes = ((Long) entity.getProperty("likes")).intValue();

      commentsList.add(new Comment(id, username, comment, createdAt, likes));
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

    Entity commentEntity = new Entity("Comment");
    commentEntity.setProperty("username", username);
    commentEntity.setProperty("comment", comment);
    commentEntity.setProperty("createdAt", createdAt);
    commentEntity.setProperty("likes", likes);

    datastore.put(commentEntity);

    long id = commentEntity.getKey().getId();

    Gson gson = new Gson();
    String data = gson.toJson(new Comment(id, username, comment, createdAt, likes));

    response.getWriter().println(data);
  }

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

    Gson gson = new Gson();
    String data = gson.toJson(new Comment(commentEntity.getKey().getId(), username, comment, createdAt, likes));

    response.getWriter().println(data);
  }

  private String getBody(HttpServletRequest request) throws IOException {
    String method = request.getMethod();
    if (method == "POST" || method == "PUT") {
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

  private String getAttribute(JSONObject json, String attribute, String defaultValue) {
    String value = (String) json.get(attribute);
    if (value == null) {
      return defaultValue;
    }

    return value;
  }

  private int parsePageParam(String page) {
    if (page != null)
      return Integer.parseInt(page);

    return 1;
  }

  private int parsePageSizeParam(String pageSize) {
    if (pageSize != null)
      return Integer.parseInt(pageSize);

    return 5;
  }

  private SortDirection parseOrderParam(String order) {
    switch ((order != null) ? order : "") {
    case "asc":
      return SortDirection.ASCENDING;
    case "desc":
      return SortDirection.DESCENDING;
    default:
      return SortDirection.DESCENDING;
    }
  }

  private String parseOrderByParam(String orderBy) {
    switch ((orderBy != null) ? orderBy : "") {
    case "createdAt":
      return "createdAt";
    case "likes":
      return "likes";
    default:
      return "createdAt";
    }
  }
}
