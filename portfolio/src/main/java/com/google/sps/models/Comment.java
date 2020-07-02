package com.google.sps.models;

import java.util.Date;

public class Comment {
  private String username;
  private String comment;
  private Date createdAt;

  public Comment(String _username, String _comment, Date _createdAt) {
    username = _username;
    comment = _comment;
    createdAt = _createdAt;
  }

  public String getUsername() {
    return username;
  }

  public String getComment() {
    return comment;
  }
 
  public Date getCreatedAt() {
    return createdAt;
  }
}
