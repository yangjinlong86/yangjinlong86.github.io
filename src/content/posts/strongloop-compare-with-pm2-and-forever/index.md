---

slug: "/strongloop-compare-with-pm2-and-forever"

description: "StrongLoop compare with pm2 and Forever"
title: StrongLoop compare with pm2 and Forever
date: "2018-06-12 11:02:30"
summary: "StrongLoop compare with pm2 and Forever"
tags: ['coding']

---

| Feature                          | StrongLoop Process Manager                               | pm2                                                     | Forever                    |
| -------------------------------- | -------------------------------------------------------- | ------------------------------------------------------- | -------------------------- |
| Run app locally                  | slc start                                                | pm2 start app.js -name foo                              | forever start app.js       |
| Restart on failure               | Yes                                                      | Yes                                                     | Yes                        |
| Graceful/rolling restarts        | Available                                                | Available                                               | No                         |
| OS startup script support        | Yes                                                      | Yes                                                     | No                         |
| Security                         | HTTP auth and HTTP+SSH                                   | SSH only for deploy                                     | No                         |
| Set environment variables        | Available on install and with slc ctl env-set command    | Available as part of ecosystem configuration            | No                         |
| Log aggregation/rotation         | Yes; log file and syslog                                 | Yes; multihost, with rotation. Log file only; no syslog | No                         |
| Multiple app support             | Manages multiple local or remote apps                    | Manages multiple local or remote apps                   | Manage multiple local apps |
| Language Support                 | Node only                                                | Can run any script file                                 | Can run any script file    |
| Build & Deploy                   |                                                          |                                                         |                            |
| Build and package repositories   | Supports Git and npm-pack based builds                   | No                                                      | No                         |
| Deploy apps to Docker container  | Yes                                                      | No                                                      | No                         |
| Remote deploy                    | Yes                                                      | Yes                                                     | No                         |
| Multiple deploys/revert          | Deploys over SSH, HTTP.  Revert any previous deployment. | Deploys over SSH, revert to previous deployment         | No                         |
| Clustering & Management          |                                                          |                                                         |                            |
| Clustering                       | Available                                                | Available                                               | No                         |
| Resize clusters                  | At deploy-time, start-time, and runtime                  | At deploy-time and start-time only                      | No                         |
| Manage remotely                  | Deploy over SSH+HTTP Manage over REST (+SSH)             | Deploy over SSH                                         | No                         |
| Load balancer auto-configuration | Yes                                                      | No                                                      | No                         |
| Profiling                        |                                                          |                                                         |                            |
| Profiling                        | Heap and CPU profiles                                    | No                                                      | No                         |
| Profile triggering               | Trigger profiling based on slow event loop               | No                                                      | No                         |
| Metrics                          |                                                          |                                                         |                            |
| Metrics                          | CPU, memory, database, NoSQL connectors, many others     | CPU, memory, stack traces reported on error output      | No                         |
| Integrate with external metrics  | Yes: StatsD, graphite, Splunk, etc.                      | keymetrics.io only                                      | No                         |