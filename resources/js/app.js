/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

window.Vue = require('vue');

//laravel-vue-pagination
Vue.component('pagination', require('laravel-vue-pagination'));

//Add Not found Component
//Ex. <not-found></not-found>
Vue.component(
    'not-found',
    require('./components/NotFoundComponent.vue').default
);

//import gate.js
import Gate from "./gate";
Vue.prototype.$gate = new Gate(window.user);


//Laravel Passport
Vue.component(
    'passport-clients',
    require('./components/passport/Clients.vue').default
);

Vue.component(
    'passport-authorized-clients',
    require('./components/passport/AuthorizedClients.vue').default
);

Vue.component(
    'passport-personal-access-tokens',
    require('./components/passport/PersonalAccessTokens.vue').default
);

//sweetalert
import swal from 'sweetalert2'
window.swal = swal;
const toast = swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000
});
window.toast = toast;

//VueProgressBar
import VueProgressBar from 'vue-progressbar'

Vue.use(VueProgressBar, {
  color: 'rgb(11, 134, 200)',
  failedColor: 'red',
  height: '20px !important'
})

//moment
import moment from 'moment'


//vForm
import { Form, HasError, AlertError } from 'vform'
window.Form = Form;
Vue.component(HasError.name, HasError)
Vue.component(AlertError.name, AlertError)

//Vue Router
import VueRouter from 'vue-router'
Vue.use(VueRouter)
let routes = [
    { path: '/home', component: require('./components/Home.vue').default },
    { path: '/dashboard', component: require('./components/DashboardComponent.vue').default },
    { path: '/users', component: require('./components/UsersComponent.vue').default },
    { path: '/developer', component: require('./components/DeveloperComponent.vue').default },
    { path: '/profile', component: require('./components/ProfileComponent.vue').default },
    //if path not matching for above if will show not found page
    { path: '*', component: require('./components/NotFoundComponent.vue').default },
]
const router = new VueRouter({
    mode : 'history',
    routes // short for `routes: routes`
})

//try to use vue function
Vue.filter('upText', function(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
});

Vue.filter('setDate', function(date) {
    return moment(date).format('DD/MM/YYYY HH:mm');
});

//Fire
window.Fire = new Vue();

/**
 * The following block of code may be used to automatically register your
 * Vue components. It will recursively scan this directory for the Vue
 * components and automatically register them with their "basename".
 *
 * Eg. ./components/ExampleComponent.vue -> <example-component></example-component>
 */

// const files = require.context('./', true, /\.vue$/i);
// files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default));

Vue.component('example-component', require('./components/ExampleComponent.vue').default);

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

const app = new Vue({
    el: '#app',
    router,
    data: {
        search: ''
    },
    methods: {
        //call the function in 1 sec.
        searchit: _.debounce(() => {
            Fire.$emit('searching');
        },1000)
    },
});
