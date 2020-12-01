<template>
    <div class="container">
        <div id="map-situation-container" style="width: 100%;height: 100%"></div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            map: null,
            x: null,
            y: null,
            infoWindow: null
        }
            
    },
    mounted() {
        this.initMap()
    },
    methods: {
        // 注意 地图不要缩小的太厉害，否则鼠标点击的位置不准确，会读取不到交通态势的数据
        initMap() {
            this.map = new AMap.Map('map-situation-container', {
                resizeEnable: true,
                zoom: 12
            })
            // 给地图添加一个监听事件，用来监听点击事件，获取点击点的坐标
            AMap.event.addListener(this.map, 'click', this.getLocation)
        },
        // 获取点击点的坐标
        getLocation(e) {
            this.map.clearMap();
            this.x = e.lnglat.getLng();
            this.y = e.lnglat.getLat();
            var marker = new AMap.Marker({
                icon: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
                position: [this.x, this.y]
            });
            marker.setMap(this.map);
            this.traffic()
            this.getSituation()

        },
        // 获取点击点的交通状态，并加载infobox
        getSituation() {
            let params = {
                "location": this.x + ',' + this.y,
                "radius":"1000",
                "output": "json",
                "level": 4
            }
            this.axios.post('http://localhost:2020/gould/circleTraffic', params).then(res => {
                let { code, data } = res.data
                if (code === 200) {
                    var info = []
                    info.push('<div><div><img src=\' https://webapi.amap.com/images/autonavi.png \'/></div> ')
                    info.push('<div class="title" style=\'font-size:15px;font-weight:800\'>流量综述：</div>')
                    info.push('<p style=\'padding-left:10px\'> ' + data.trafficinfo.description + '</p>')
                    info.push('<div class="title" style=\'font-size:15px;font-weight:800\'>流量评价：</div>')
                    info.push('<p style=\'padding-left:10px\'>畅通百分比：' + data.trafficinfo.evaluation.expedite + '</p>')
                    info.push('<p style=\'padding-left:10px\'>缓行百分比：' + data.trafficinfo.evaluation.congested + '</p>')
                    info.push('<p style=\'padding-left:10px\'>拥堵百分比：' + data.trafficinfo.evaluation.blocked + '</p>')
                    info.push('<p style=\'padding-left:10px\'>未知路段百分比：' + data.trafficinfo.evaluation.unknown + '</p></div>')
                    this.infoWindow = new AMap.InfoWindow({
                        content: info.join("")  //使用默认信息窗体框样式，显示信息内容
                    });
                    var center = {
                        Q: this.y,
                        R: this.x,
                        lng: this.x,
                        lat: this.y,
                    }
                    this.infoWindow.open(this.map, center);
                }
            })
        },
        // 交通状况图层
        traffic() {
            var trafficLayer = new AMap.TileLayer.Traffic({
                zIndex: 15
            });

            trafficLayer.setMap(this.map);

            var isVisible = true;
            function toggle() {
                if (isVisible) {
                    trafficLayer.hide();
                    isVisible = false;
                } else {
                    trafficLayer.show();
                    isVisible = true;
                }
            }
        }
    }
}
</script>
<style scoped>
    .container {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
    }
</style>