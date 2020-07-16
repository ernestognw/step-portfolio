package com.google.sps.models;

public class Comment {
  private long id;
  private String username;
  private String comment;
  private long createdAt;
  private int likes;
  private String sentiment;

  public Comment(long _id, String _username, String _comment, long _createdAt, int _likes, String _sentiment) {
    id = _id;
    username = _username;
    comment = _comment;
    createdAt = _createdAt;
    likes = _likes;
    sentiment = _sentiment;
  }

  public long getId() {
    return id;
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
  
  public int getLikes() {
    return likes;
  }

  public String getSentiment() {
    return sentiment;
  }
}
