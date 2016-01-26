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

-   dataitem view
    -   cleanup code
    -   better filtering
    -   sorting
    -   fetch using sample since last update
    -   configurable update period
-   history view
    -   create history view
    -   graph / history of data items
-   settings
    -   create settings page
    -   configure agent location
-   Other things that I've forgotten