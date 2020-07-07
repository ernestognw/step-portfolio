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
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.SortDirection;
import com.google.gson.Gson;
import com.google.sps.models.Comment;
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

    Query query = new Query("Comment").addSort("createdAt", SortDirection.DESCENDING);
    PreparedQuery results = datastore.prepare(query);

    List<Comment> comments = new ArrayList<>();
    for (Entity entity : results.asIterable()) {
      String username = (String) entity.getProperty("username");
      String comment = (String) entity.getProperty("comment");
      long createdAt = (long) entity.getProperty("createdAt");

      comments.add(new Comment(username, comment, createdAt));
    }

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

    Entity commentEntity = new Entity("Comment");
    commentEntity.setProperty("username", username);
    commentEntity.setProperty("comment", comment);
    commentEntity.setProperty("createdAt", createdAt);

    datastore.put(commentEntity);

    Gson gson = new Gson();
    String data = gson.toJson(commentEntity);

    response.getWriter().println(data);
  }

  private String getBody(HttpServletRequest request) throws IOException {
    if ("POST".equalsIgnoreCase(request.getMethod())) {
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
}
