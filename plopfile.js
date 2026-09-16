module.exports = function (plop) {
  plop.setGenerator('module', {
    description: 'Generate Controller, Service, Route, and Model files',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'What is the module name? (e.g. poll, user, order)'
      }
    ],
    actions: [
      {
        type: 'add',
        path: 'src/presentation/controllers/{{camelCase name}}Controller.js',
        templateFile: 'templates/controller.js.hbs'
      },
      {
        type: 'add',
        path: 'src/services/{{camelCase name}}Service.js',
        templateFile: 'templates/service.js.hbs'
      },
      {
        type: 'add',
        path: 'src/presentation/routes/v1/{{camelCase name}}Routes.js',
        templateFile: 'templates/route.js.hbs'
      },
      {
        type: 'add',
        path: 'src/persistence/models/{{pascalCase name}}.js',
        templateFile: 'templates/model.js.hbs'
      }
    ]
  });
};