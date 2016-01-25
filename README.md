# MTConnect-Viewer

An MTConnect agent viewer, intended to be an HTML app that could be dropped into the `public` folder of the MTConnect agent.
This is a work-in progress. The code is a mess at present.

## Installation

1.  Clone repo.
2.  Run `bower install`
3.  Modify the `AGENT_URL` constant in `index.html` to the base URL of the MTConnect agent
    -   Note: if this project is not being served by the MTC agent, the MTC agent must support CORS.
    -   Suggested NPM package: `corsproxy`
4.  Load `index.html` in browser and click the "Fetch" button.

## TODO

In no particular order:

-   Cleanup dataitem code
-   Color-code conditions in view
-   Sortable, filterable dataitem view
-   Periodic refresh of dataitem values
-   Fetch using sample since last update, rather than current
-   Graph/historical view of data items
-   Settings page to configure agent location, pinned dataitems
-   Other things that I've forgotten