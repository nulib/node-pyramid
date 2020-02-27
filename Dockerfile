FROM       node:13-alpine
USER       node
WORKDIR    /home/node
COPY       --chown=node:node package.json yarn.lock /home/node/
RUN        yarn install
CMD        ["/usr/local/bin/node", "./queue.js"]
COPY       --chown=node:node cli.js queue.js pyramid.js /home/node/
