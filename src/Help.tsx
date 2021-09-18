import * as React from 'react';

import './Help.css';

export default function Help(props: { hideHelp: () => void }): JSX.Element {
  const { hideHelp } = props;

  return (
    <aside>
      <h3>
        Tasker Tracker is a tool to generate{' '}
        <a href="https://tasker.joaoapps.com/" rel="noreferrer" target="_blank">
          Tasker
        </a>{' '}
        configs for tracking stuff on a Google Sheet.
      </h3>
      <p>
        For example, you might be interested in keeping a log of what you have
        for breakfast in the morning, along with when and where you have your
        breakfast. With a Tasker Tracker config defined with a list of possible
        breakfast foods as options, all you'd need to do is tap a single button
        on your phone at breakfast, and Tasker handles the rest.
      </p>
      <h3>Tasker Tracker can track all sorts of stuff.</h3>
      <p>Here are a few ideas:</p>
      <ul>
        <li>What you have for breakfast each day (Spam, Eggs, Ham)</li>
        <li>What mood you're in throughout the day (on a scale of 1 to 5)</li>
        <li>
          What you're doing throughout the day (Eating, Exercising, Playing,
          Sleeping, Socializing, Working)
        </li>
        <li>
          <a
            href="https://www.bbc.com/future/article/20190403-how-much-water-should-you-drink-a-day"
            rel="noreferrer"
            target="_blank"
          >
            How often you drink water
          </a>
        </li>
        <li>When you use the toilet</li>
        <li>When your dog uses the toilet</li>
      </ul>
      <p>
        You track multiple categories of events in a config&mdash;just come up
        with a list of options for each category as you enter them into this
        config generator.
      </p>
      <h3>
        To get started, you'll need to create a spreadsheet in Google Sheets.
      </h3>
      <p>
        Tasker Tracker works by appending a row to a Google Sheet each time you
        trigger a task. The easiest way to get started is to make a copy of{' '}
        <a
          href="https://docs.google.com/spreadsheets/d/1FM4yns1OOVF2VmTaK00dLNSP6s5HavDLmp8yHKbOWF0/edit?usp=sharing"
          rel="noreferrer"
          target="_blank"
        >
          this spreadsheet
        </a>{' '}
        into your own Google Drive account. (Remember to delete the sample data
        rows before you start logging!)
      </p>
      <p>
        If you want to do it yourself, start by creating an empty sheet with
        four columns and one row for each category you want to track.
        Optionally, create a second sheet (named <samp>Sheet2</samp>) that
        combines the most recent items tracked into a single cell.
      </p>
      <h3>There's no limit to what you can do with the logged data!</h3>
      <p>
        The spreadsheet template above includes a few basic transformations and
        charts to get you started with visualizations.
      </p>
      <button className="button-stub overlay-close" onClick={hideHelp}>
        Close
      </button>
    </aside>
  );
}
