FROM       node:10-slim
USER       node
WORKDIR    /home/node
COPY       --chown=node:node package.json package-lock.json /home/node/
RUN        npm install
ENTRYPOINT ["/home/node/create-pyramid"]
CMD        []
COPY       --chown=node:node create-pyramid index.js pyramid.js /home/node/
