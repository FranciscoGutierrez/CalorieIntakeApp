# CalorieIntakeApp
Testing some simulations and viz.

## Before meteor command in console:
``
export MONGO_URL=mongodb://<dbuser>:<dbpassword>@ds161400.mlab.com:61400/healthyfoods
``
## Then:
``
meteor
``


# Export to csv
``
mongoexport --host localhost --port 3001 --db meteor --collection logs --type=csv --fields user,product,plate,time,action --out logs.csv
mongoexport --host localhost --port 3001 --db meteor --collection users --type=csv --fields age,gender,weight,height,activity,allergies,time_start,time_end,favorites --out users.csv


mongoexport --host localhost --port 3001 --db meteor --collection similar --type=csv --fields pid,similarity --out similar.csv

``

mongoimport -h 127.0.0.1:3001/meteor -c series --file series.json

mongoimport --host localhost --port 3001 --db meteor --collection series --file series.json
