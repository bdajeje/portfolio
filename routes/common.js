module.exports = {
  routes: {
    home: '/',
    projects: '/projects',
    project: '/projects/:name',
    project_info: '/project/info/:id',
    contact: '/contact',
    cv: '/cv',
    language: '/language/:lang',
    github: 'https://github.com/bdajeje',
    info: '/info/:value',
    admin: {
      authentication: '/admin',
      login: '/admin-login',
      secured_pages: '/admin/*',
      dashboard: '/admin/dashboard',
      logout: '/admin/logout',
      new_project: '/admin/new',
      edit_project: '/admin/edit',
      delete_project: '/admin/delete'
    }
  }
}
