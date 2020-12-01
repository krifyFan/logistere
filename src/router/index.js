import Vue from "vue";
import VueRouter from "vue-router";
import Index from "../views/index.vue"
import IndexSDK from "../views/indexSDK.vue"
import HeatMap from "../views/heatMap.vue"
import SearchPoint from "../views/searchPoint.vue"
import SituationMap from "../views/mapSituation.vue"

Vue.use(VueRouter);

const routes = [
	{
		path: "/",
		// redirect: '/heatMap',
		name: "IndexSDK",
		component: IndexSDK
	},
	{
		path: '/heatMap',
		name: 'heatMap',
		component: HeatMap
	},
	{
		path: '/point',
		name: 'point',
		component: SearchPoint
	},
	{
		path: '/situation',
		name: 'situation',
		component: SituationMap
	}

];

const router = new VueRouter({
 	routes
});

export default router;

