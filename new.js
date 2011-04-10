#!/usr/bin/env node

(function(global) {
  var exec = require('child_process').exec,
      fs = require('fs'),
      initializr_url = 'http://initializr.com/generate/?',
      archive_name = 'initializr' + process.pid + '.zip',
      curl_command = 'curl -s "#URL#" > ' + archive_name,
      unzip_command = 'unzip ' + archive_name,
      git_command = 'git init',
      params = process.argv.slice(2),
      project_name,
      initializr_options = {
        'Boilerplate': ['boilerplate'],
        'JavaScript': ['no-js', 'no-jq', 'jqdev'],
        'IE support': ['no-cond', 'oldie'],
        'Mobile support': ['hand'],
        'HTML5 Compatibilty': ['shiv', 'no-compat'],
        'Server config': ['htaccess', 'webconfig', 'nginx'],
        'Statistics': ['analytics']
      },
      allowedParams = [],
      helpBundle = "\n\tUsage: new.js <project_name> [option1, option2...]\n" +
          "\tOptions are:";

  for (var key in initializr_options) {
    if (initializr_options.hasOwnProperty(key)) {
      allowedParams = allowedParams.concat(initializr_options[key]);
      helpBundle += "\n\t * " + key + ": " + initializr_options[key].join(", ");
    }
  }

  helpBundle += "\n\n\tExample: new.js no-jq no-cond hand no-compat" +
      "\n\tSee http://html5boilerplate.com/ and http://initializr.com/ for more detail.\n\n";

  if (!params[0] || params[0] === "help") {
    process.stdout.write(helpBundle);
    process.exit();
  }

  project_name = params.shift();

  params.forEach(function(el) {
    if (allowedParams.indexOf(el) === -1) {
      throw "Unknown parameter: " + el;
    }
    initializr_url += "&" + el;
  });

  fs.mkdir(project_name, 0777, function(error) {
    if (error) {
      throw "Error creating directory.";
    }
    process.chdir(project_name);
    exec(curl_command.replace("#URL#", initializr_url), function(error) {
      if (error) {
        throw "Error downloading initializr!";
      }
      exec(unzip_command, function(error) {
        if (error) {
          throw "Error unzipping initializr!";
        }
        fs.unlink(archive_name, function(error) {
          if (error) {
            throw "Error removing initializr archive!";
          }
          exec(git_command, function(error) {
            if (error) {
              throw "Error creating git repository!";
            }
          });
        });
      });
    });
  });
}(this));
