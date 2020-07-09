package com.google.sps.models;

/**
 * Comment class is the data model for both saving comments
 * and returning them in the API response
 */
public class Comment {
  private long id;
  private String username;
  private String comment;
  private long createdAt;
  private int likes;
  private String sentiment;

  /**
   * Comment Constructor
   * Is used to create a comment, in order to
   * send it to client in JSON format
   * 
   * @param _id Unique number to identify the comment. Default set by datastore
   * @param _username Name of the user
   * @param _comment Comment content
   * @param _createdAt Date in which the comment was created in milliseconds
   * @param _likes Nombre of likes
   * @param _sentiment Sentiment classification of _comment
   */
  public Comment(long _id, String _username, String _comment, long _createdAt, int _likes, String _sentiment) {
    id = _id;
    username = _username;
    comment = _comment;
    createdAt = _createdAt;
    likes = _likes;
    sentiment = _sentiment;
  }

  /**
   * @return the comment id used to identify it in datastore
   */
  public long getId() {
    return id;
  }

  /**
   * @return the name of the user who commented
   */
  public String getUsername() {
    return username;
  }

  /**
   * @return the comment itself
   */
  public String getComment() {
    return comment;
  }
 
  /**
   * @return comment date creating in milliseconds
   */
  public long getCreatedAt() {
    return createdAt;
  }
  
  /**
   * @return number of likes for the comment
   */
  public int getLikes() {
    return likes;
  }

  /**
   * @return sentiment assigned according to the score the comment got
   */
  public String getSentiment() {
    return sentiment;
  }
}
