package com.google.sps.common;

/**
 * SentimentScoreBoundries holds the boundries to classify
 * a comment based on its score
 */
public interface SentimentScoreBoundaries {
  double lower = -1;
  double neutralLow = -0.3;
  double neutralHigh = 0.3;
  double higher = 1;
}