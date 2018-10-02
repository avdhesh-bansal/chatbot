#! /bin/sh

# NOTE: Make sure you run this script after running cf api, cf login, cf target

while read -r l;
do
  var_name="$(sed 's/=.*$//' <<<$l)"
  var_val="$(sed -E 's/^[^=]+=//' <<<$l)"
  echo "Going to set env variable " $var_name=$var_val
  cf push $var_name $var_val
done < <(grep -E -v '^\s*(#|$)' .env)
