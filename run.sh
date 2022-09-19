if [ -d "node_modules" ]; then
  npm start
fi
if [ ! -d "node_modules" ]; then
  npm install
  npm start
fi
