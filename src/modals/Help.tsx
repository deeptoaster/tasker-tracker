import * as React from 'react';

import Link from '../components/Link';
import Modal from '../components/Modal';

export default function Help(props: { hideHelp: () => void }): JSX.Element {
  const { hideHelp } = props;

  return (
    <Modal actions={[{ label: 'Close', onClick: hideHelp }]}>
      <h3>What's Tasker Tracker?</h3>
      <p>
        <strong>
          Tasker Tracker helps you track stuff with{' '}
          <Link external={true} href="https://tasker.joaoapps.com/">
            Tasker
          </Link>{' '}
          and Google Sheets.
        </strong>{' '}
        For example, you might be interested in keeping a log of what you have
        for breakfast in the morning, along with when and where you have your
        breakfast. With Tasker Tracker, all you'd need to do is tap a single
        button on your phone at breakfast, and it all gets fed into pretty
        charts.
      </p>
      <h3>What can I do with it?</h3>
      <p>
        <strong>Tasker Tracker can track all sorts of stuff.</strong> Here are a
        few ideas:
      </p>
      <ul>
        <li>What you have for breakfast each day (Spam, Eggs, Ham)</li>
        <li>What mood you're in throughout the day (on a scale of 1 to 5)</li>
        <li>
          What you're doing throughout the day (Eating, Exercising, Playing,
          Sleeping, Socializing, Working)
        </li>
        <li>
          <Link
            external={true}
            href="https://www.bbc.com/future/article/20190403-how-much-water-should-you-drink-a-day"
          >
            How often you drink water
          </Link>
        </li>
        <li>When you use the toilet</li>
        <li>When your dog uses the toilet</li>
      </ul>
      <p>
        You track multiple categories at once&mdash;just come up with a list of
        options for each category as you enter them into the tool.
      </p>
      <h3>How do I get started?</h3>
      <ol>
        <li>
          Make a copy of{' '}
          <Link
            external={true}
            href="https://docs.google.com/spreadsheets/d/1FM4yns1OOVF2VmTaK00dLNSP6s5HavDLmp8yHKbOWF0/edit?usp=sharing"
          >
            this spreadsheet
          </Link>{' '}
          into your own Google Drive account. (This is where your stuff gets
          logged!)
        </li>
        <li>Use this tool to create and download your Tasker config.</li>
        <li>
          Extract the Project XML files from the ZIP and{' '}
          <Link
            external={true}
            href="https://www.reddit.com/r/tasker/comments/7g7694/how_to_import_a_file_into_tasker_a_quick_easy/"
          >
            import them into Tasker
          </Link>
          .
        </li>
        <li>
          <Link
            external={true}
            href="https://tasker.joaoapps.com/userguide/en/app_widgets.html"
          >
            Set up some Shortcuts in Tasker
          </Link>{' '}
          (or any other way you'd like to trigger the tasks to run).
        </li>
      </ol>
      <p>
        <strong>
          There's no limit to what you can do with the logged data!
        </strong>{' '}
        The spreadsheet template includes a few basic transformations and charts
        to get you started with visualizations, but don't that stop you from
        creating more.
      </p>
    </Modal>
  );
}
