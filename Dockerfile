FROM       node:11-alpine
RUN        npm -g install yarn
USER       node
WORKDIR    /home/node
COPY       --chown=node:node package.json yarn.lock /home/node/
RUN        yarn install
ENTRYPOINT ["/home/node/create-pyramid"]
CMD        []
COPY       --chown=node:node create-pyramid cli.js queue.js pyramid.js /home/node/
