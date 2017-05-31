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

``
