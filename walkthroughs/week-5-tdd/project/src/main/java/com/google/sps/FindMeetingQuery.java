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

package com.google.sps;

import java.util.Collection;
import java.util.Collections;
import java.util.Arrays;
import java.util.ArrayList;
import java.util.Set;
import java.util.HashSet;

public final class FindMeetingQuery {
  private final int AVAILABLE = 0;
  private final int NOT_AVAILABLE = 1;
  private final int MINUTES_IN_A_DAY = 60 * 24;

  /**
   * Find a collection of time ranges suitable to have a meeting
   * 
   * This method is an operation to handle new meeting requests, by receiving the
   * incoming request, and a list of existing meetings. It resolves the available
   * slots to have the meeting, returning time slots with the following priority
   * order:
   * 
   * 1. Return slots when every attendee (both mandatory and optional) can attend
   * 2. Return slots when only mandatory attendees can attend 3. Return empty
   * collection when the meeting is no suitable
   * 
   * ====== Algorithmic analysis ====== 
   * 
   * let N = Already scheduled events
   * let M = Attendees within scheduled events
   *
   * Time complexity: N * M since for each event, we do a disjoint in O(M)
   * Space complexity: max(N, M) since the greatest memory allocation could be
   * from events or attendees
   * 
   * Notes: Usually the largest memory allocation could be both attendeesSchedule
   * and optionalAttendeesSchedule, but these are considerated constants

   * 
   * @param events  Collection of events happening during the day
   * @param request Object with the data about the meeting to be scheduled
   * @return A collection of time ranges available to meet. It prioritizes time
   *         ranges in which both optional and mandatory attendees can attend.
   */
  public Collection<TimeRange> query(Collection<Event> events, MeetingRequest request) {
    Integer[] attendeesSchedule = new Integer[MINUTES_IN_A_DAY];
    Integer[] optionalAttendeesSchedule = new Integer[MINUTES_IN_A_DAY];

    // Assume available schedules as default.
    Arrays.fill(attendeesSchedule, AVAILABLE);
    Arrays.fill(optionalAttendeesSchedule, AVAILABLE);

    Set<String> mandatoryAttendees = new HashSet<String>(request.getAttendees());
    Set<String> optionalAttendees = new HashSet<String>(request.getOptionalAttendees());

    ArrayList<Event> eventsToVerify = new ArrayList<>(events);
    for (Event event : eventsToVerify) {
      // Check if any of the attendees are scheduled for the current event to verify,
      // in order to fill schedules with not available status
      Set<String> eventAttendees = event.getAttendees();
      // Disjoints run in O(M) according to this: https://stackoverflow.com/questions/61923114/hashset-disjoint-complexity
      Boolean isAnyMandatoryAttendeeBusy = !Collections.disjoint(eventAttendees, mandatoryAttendees);
      Boolean isAnyOptionalAttendeeBusy = !Collections.disjoint(eventAttendees, optionalAttendees);

      TimeRange eventRange = event.getWhen();
      int start = eventRange.start();
      int end = eventRange.start() + eventRange.duration();

      // Fill the event time range as not available for mandatory attendees
      // when there is at least one mandatory attendee not available
      if (isAnyMandatoryAttendeeBusy) {
        Arrays.fill(attendeesSchedule, start, end, NOT_AVAILABLE);
      }

      // Fill the event time range as not available for optional attendees
      // when there are any attendee busy, whether mandatory or not
      if (isAnyMandatoryAttendeeBusy || isAnyOptionalAttendeeBusy) {
        Arrays.fill(optionalAttendeesSchedule, start, end, NOT_AVAILABLE);
      }
    }

    // Calculate available ranges for optional attendees, since this schedule
    // considers the mandatory attendees as well
    ArrayList<TimeRange> optionalAttendeesSlots = calculateAvailableRanges(optionalAttendeesSchedule);
    long duration = request.getDuration();
    ArrayList<TimeRange> availableTimeRanges = calculateAvailableSlots(optionalAttendeesSlots, duration);

    // If there is no available time range including optional attendees
    // return the available time ranges not including optionals
    if (availableTimeRanges.size() == 0) {
      ArrayList<TimeRange> mandatoryAttendeesSlots = calculateAvailableRanges(attendeesSchedule);
      return calculateAvailableSlots(mandatoryAttendeesSlots, duration);
    } else {
      return availableTimeRanges;
    }
  }

  /**
   * Calculate available time ranges in a minute schedule provided
   * 
   * @param minutesSchedule An array of minutes in a day, representing those
   *                        available or not during that day
   * @return A list of TimeRange's for the time windows in the minute schedule
   */
  private ArrayList<TimeRange> calculateAvailableRanges(Integer[] minutesSchedule) {
    int rangeSize = 0;
    ArrayList<TimeRange> ranges = new ArrayList<>();
    for (int i = 0; i < minutesSchedule.length; i++) {
      if (minutesSchedule[i] == AVAILABLE) {
        rangeSize++;
      } else if (rangeSize != NOT_AVAILABLE) {
        ranges.add(TimeRange.fromStartDuration(i - rangeSize, rangeSize));
        rangeSize = 0;
      }
    }

    // Add the last range to the slot, this is missed in the previous for loop
    // Will be a 0 time range when the last part of the schedule is busy
    ranges.add(TimeRange.fromStartDuration(minutesSchedule.length - rangeSize, rangeSize));

    return ranges;
  }

  /**
   * To calculate which time ranges are suitable to have a meeting of a given
   * duration.
   * 
   * @param ranges   List of candidate time ranges to held the meeting
   * @param duration Numeric representation of a meeting duration
   * @return The list of time ranges in which the meeting can be held
   */
  private ArrayList<TimeRange> calculateAvailableSlots(ArrayList<TimeRange> ranges, long duration) {
    ArrayList<TimeRange> timeRanges = new ArrayList<>();

    // Whenever a time range has is greater than the event duration
    // we have found a potential solution
    for (TimeRange timeRange : ranges) {
      if (timeRange.duration() >= duration)
        timeRanges.add(timeRange);
    }

    return timeRanges;
  }
}
