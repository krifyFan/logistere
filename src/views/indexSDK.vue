<template>
    <div class="container">
        <div id="amap-container" style="width:100%;height: 100%" />
    </div>
</template>
<script>	
export default {
    data() {
        return {
            map: null,
            markerList: [],
            center: null
        }
    },
    mounted() {
        this.initMap()
    },
    methods: {
        // 初始化地图
        initMap() {
            // 此处的222.72.158.166为你的ip地址 更换成你的即可
            this.axios.get('http://localhost:2020/gould/ip?ip=222.72.158.166').then(res => {
                let { code, data } = res.data
                if (code === 200) {
                    // 根据ip获取坐标
                    this.center = data.rectangle[0]
                }
            })
            // 初始化地图
            this.map = new AMap.Map('amap-container', {
                zoom: 5, // zoom的取值范围为[3,18],值越小，可视范围越大，可根据自己需求做调整
                center: this.center,
            })

            this.initMarkers()
        },
        initMarkers() {
            this.axios.get('http://localhost:2020/gould/countrySerch').then(res => {
                let { code, data, msg } = res.data
                if (code === 200) {
                    data.forEach(element => {
                        var result = element.location.split(',')
                        var item = {
                            position: result
                        }
                        this.markerList.push(item)
                    });
                    this.markerList.forEach(marker => {
                        new AMap.Marker({
                            map: this.map,
                            icon: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_r.png',
                            position: [marker.position[0], marker.position[1]],
                            offset: new AMap.Pixel(-13, -30)
                        })
                    })
                }
            })
        }
    }
}
</script>
<style scoped>
    .container {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
    }
</style>