package com.google.sps.models;

public class Comment {
  private String username;
  private String comment;
  private long createdAt;

  public Comment(String _username, String _comment, long _createdAt) {
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
 
  public long getCreatedAt() {
    return createdAt;
  }
}
