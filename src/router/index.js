import Vue from "vue";
import VueRouter from "vue-router";
import firebase from "firebase";

import Home from "@/views/Home.vue";
import Login from "@/views/Login.vue";
import Songs from "@/views/Songs.vue";
import Playlists from "@/views/Playlists.vue";
import PlaylistDetail from "@/views/PlaylistDetail.vue";

Vue.use(VueRouter);

const routes = [
  { path: "*", redirect: "/" },
  {
    path: "/",
    name: "Home",
    component: Home,
    children: [
      {
        path: "songs",
        component: Songs
      },
      {
        path: "playlists",
        name: "playlists",
        component: Playlists
      },
      {
        path: "playlists/:id",
        name: "playlistDetails",
        component: PlaylistDetail
      }
    ],
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/login",
    name: "Login",
    component: Login
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth);
  const currentUser = firebase.auth().currentUser;

  if (requiresAuth && !currentUser) {
    next("/login");
  } else if (requiresAuth && currentUser) {
    next();
  } else {
    next();
  }
});
export default router;
