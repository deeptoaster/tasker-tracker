# Tasker Tracker

An easy tool to set up quantified self, mood, or time tracking for Google
Sheets using Tasker

https://fishbotwilleatyou.com/tracker/

https://fishbotwilleatyou.com/blog/tasker-tracker/

![](http://fishbotwilleatyou.com/bin/images/showcase_tracker.gif)

## About

**Tasker Tracker helps you track stuff with
[Tasker](https://tasker.joaoapps.com/) and Google Sheets.** For example, you
might be interested in keeping a log of what you have for breakfast in the
morning, along with when and where you have your breakfast. With Tasker
Tracker, all you'd need to do is tap a single button on your phone at
breakfast, and it all gets fed into pretty charts.

### What can I do with it?

**Tasker Tracker can track all sorts of stuff.** Here are a few ideas:

- What you have for breakfast each day (Spam, Eggs, Ham)
- What mood you're in throughout the day (on a scale of 1 to 5)
- What you're doing throughout the day (Eating, Exercising, Playing,
  Sleeping, Socializing, Working)
- [How often you drink
  water](https://www.bbc.com/future/article/20190403-how-much-water-should-you-drink-a-day)
- When you use the toilet
- When your dog uses the toilet

You track multiple categories at once&mdash;just come up with a list of options
for each category as you enter them into the tool.

### How do I get started?

1.  Make a copy of [this
    spreadsheet](https://docs.google.com/spreadsheets/d/1FM4yns1OOVF2VmTaK00dLNSP6s5HavDLmp8yHKbOWF0/edit?usp=sharing)
    into your own Google Drive account. (This is where your stuff gets logged!)
2.  Use this tool to create and download your Tasker config.
3.  Extract the Project XML files from the ZIP and [import them into Tasker](https://www.reddit.com/r/tasker/comments/7g7694/how_to_import_a_file_into_tasker_a_quick_easy/).
4.  [Set up some Shortcuts in
    Tasker](https://tasker.joaoapps.com/userguide/en/app_widgets.html) (or any
    other way you'd like to trigger the tasks to run).

**There's no limit to what you can do with the logged data!** The spreadsheet
template includes a few basic transformations and charts to get you started
with visualizations, but don't that stop you from creating more.

## Contributing

Feedback and contributions are always welcome! If you have any bug reports,
feature requests, or questions, please open a GitHub
[issue](https://github.com/deeptoaster/tasker-tracker/issues). To contribute,
follow the instructions below to set up local development and submit a GitHub
[pull request](https://github.com/deeptoaster/tasker-tracker/pulls).

## Local Development

You will need to have [Git](https://git-scm.com/doc), [Node.js, and
npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
installed.

1.  [Create a fork of deeptoaster/tasker-tracker to your own account and clone
    it.](https://help.github.com/en/articles/fork-a-repo)
2.  In the project directory, run `npm install` to install all dependencies.
3.  Run `npm start`. This should open the development webapp at
    http://localhost:8080/ in your browser.
4.  After making your changes, [commit
    them](https://git-scm.com/docs/gittutorial#_making_changes), push them to
    your fork on GitHub, and [create a pull
    request](https://help.github.com/en/articles/creating-a-pull-request-from-a-fork)
    to deeptoaster/tasker-tracker.
