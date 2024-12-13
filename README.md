## Custom Behaviors

This repo contains a collection of site-specific custom behaviors that can be used with Browsertrix Crawler (v1.4+)

To use, specify this repo on the command line when using Browsertrix, for example:

```
docker run -it webrecorder/browsertrix-crawler crawl --url ... --custom-behaviors --customBehaviors "git+https://github.com/webrecorder/custom-behaviors?path=behaviors/
```
