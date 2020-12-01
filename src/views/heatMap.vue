<template>
    <div class="map-container">
        <div id="container"  style="width:100%;height:100%"></div>
    </div>
</template>
<script>
export default {
	data() {
		return {
			map: null,
			center: []
		}
	},
    mounted() {
		this.initMap()
		// this.getCenter()
    },
    methods: {
        initMap() {
            this.map = new AMap.Map('container', {
                features: ['bg', 'road'],
				resizeEnable: true,
				zoom: 12,
				viewMode: '2D',
				showZoomBar:true
			})
			// 初始化热力图
			var layer = new Loca.HeatmapLayer({
				map: this.map,
			});
			this.axios.get('http://localhost:2020/gould/countrySerchHot').then(res => {
				let { code, data } = res.data
				if (code === 200) {
					var list = [];
					var i = -1, length = data.length;
					while (++i < length) {
						var item = data[i];
						list.push({
							coordinate: [item.lng, item.lat],
						})
					}
					layer.setData(list, {
						lnglat: 'coordinate',
						value: 'count'
					});
			
					layer.setOptions({
						style: {
							radius: 16,
							color: {
								0.5: '#2c7bb6',
								0.65: '#abd9e9',
								0.7: '#ffffbf',
								0.9: '#fde468',
								1.0: '#d7191c'
							}
						}
					});
			
					layer.render();
				}
			})
		},
		getCenter() {
			var _this = this
			this.map.plugin('AMap.Geolocation', function() {
				var geolocation = new AMap.Geolocation({
					// 是否使用高精度定位，默认：true
					enableHighAccuracy: true,
					// 设置定位超时时间，默认：无穷大
					timeout: 10000,
					// 定位按钮的停靠位置的偏移量，默认：Pixel(10, 20)
					buttonOffset: new AMap.Pixel(10, 20),
					//  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
					zoomToAccuracy: true,     
					//  定位按钮的排放位置,  RB表示右下
					buttonPosition: 'RB'
				})
				// 获取当前位置信息
				geolocation.getCurrentPosition();
				// 监听获取位置信息成功的回调函数
				
				AMap.event.addListener(geolocation, 'complete', _this.onComplete);
			})
		},
		onComplete(data) {
			console.log("data", data)
		}
    }
}
</script>
<style scoped>
.map-container {
	width: 100%;
	height: 100%;
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
}
</style>