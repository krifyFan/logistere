<template>
    <div class="container">
        <div class="search-box">
            <input 
                v-model="city" 
                type="search"
                class="city-input" 
                placeholder="请输入城市"    
            />
            <input
                v-model="searchKey"
                type="search"
                id="search" 
                class="keywords-input"
                placeholder="请输入关键字"
                @click="initAutoComplete"
                >
            <button class="btn" @click="searchByHand()">搜索</button>
        </div>
        <div id="amap-search-container" style="width:100%;height: 100%" />
    </div>
</template>
<script>	
export default {
    data() {
        return {
            searchKey: '',
            map: null,
            center: [],
            markerList: [],
            city: '',
            infoWindow: null
        }
    },
    mounted() {
        this.initMap()
    },
    methods: {
        initMap() {
            // 初始化地图
            this.map = new AMap.Map('amap-search-container', {
                zoom: 10,
                resizeEnable: true,
            })
        },
        initAutoComplete() {
            // 关键字的提示框
            var autocomplete
            var _this = this
            AMap.plugin(['AMap.Autocomplete'], function(){
                var autoOptions = {
                    city: _this.city,
                    input: 'search', // 关键字input框的id
                    citylimit: true, // 限制城市
                    closeResultOnScroll: false
                }
                autocomplete = new AMap.Autocomplete(autoOptions)
                AMap.event.addListener(autocomplete, 'complete', function() {
                    autocomplete.search(this.searchKey)
                })
            })
        },
        // 点击搜索按钮时，触动此方法
        searchByHand() {
            // 调用设置中心点方法
            this.setCenter()
            // 查询条件
            var params = {
                "keywords": this.searchKey,
                "city": this.city,
                "output": "json",
                "offset": 50 // 每页数据数，官方建议不超过25条，否则会出错，设置50，目前没有问题，
                             // 可根据需求适当修改
            }
            // 再次点击搜索时，清除原有的marker
            if (this.markerList.length !==0 ){
                this.map.clearMap()  //清除原有坐标点
                this.markerList = []
            }
            this.axios.post('http://localhost:2020/gould/keywordsSerch', params).then(res =>{
                let { code, data } = res.data
                if (code === 200) {
                    this.placeSearch_CallBack(data, this.infoWindow)
                }
            })
            
        },
        // 更改地图中心点，使中心点位于所输城市在的省份
        setCenter() {
            var _this = this
            var geocoder
            AMap.plugin('AMap.Geocoder', function() {
                // 查询条件，输入的城市
                var geocoderOptions = {
                    city: _this.city
                }
                geocoder = new AMap.Geocoder(geocoderOptions)
                // 使用插件Geocoder自带的getLocation方法去获取城市坐标
                geocoder.getLocation(_this.city, function(status, result) {
                    if (result.info === 'OK') {
                        var arr = [result.geocodes[0].location.lng, result.geocodes[0].location.lat]
                        // 设置地图的中心点 setCenter()为map自带方法
                        _this.map.setCenter(arr)
                    }
                })
            })

        },
         //回调函数
        placeSearch_CallBack(data, infoWindow) {
            var poiArr = data.pois;
            // 再次查询的时候，先清除上次地图的marker
            this.map.clearMap()
            //添加marker
            poiArr.forEach(element => {
                let result = element.location.split(',')
                var marker = new AMap.Marker({
                    map: this.map,
                    position: result,
                    icon: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_r.png',
                });
                // 改变this的指向，使this指向全局
                // this指向问题可百度 vue this指向问题
                var _this = this
                // 给marker添加click事件
                AMap.event.addListener(marker, 'click', function(e) {
                    AMap.plugin('AMap.PlaceSearch', function () {
                        var placeSearch = new AMap.PlaceSearch({
                            map: _this.map
                        })
                        // marker对应的id
                        var poiid = element.id
                        //通过marker的id 查询相关信息，显示infoBox
                        // getDetails为插件AMap.PlaceSearch自带方法，可阅读相关文档
                        placeSearch.getDetails(poiid, function(status, result) {
                            // 查询成功时，result即为对应的POI详情
                            if (status==='complete' && result.info==='OK') {
                                _this.createContent(result.poiList.pois[0])
                            }
                        }) 
                    })
                })
            });
        },
        // 创建信息窗体
        createContent(poi) {  //信息窗体内容
            var info = []
            info.push("<b>名称：" + poi.name+"</b>");
            info.push("<p>地址：" + poi.address + "</p>");
            info.push("<p>电话：" + poi.tel + "</p>");
            info.push("<p>类型：" + poi.type + "</p>");
            this.infoWindow = new AMap.InfoWindow({
                content: info.join("")  //使用默认信息窗体框样式，显示信息内容
            });
            // 窗体显示的位置，在鼠标点击处
            var center = {
                Q: poi.location.Q,
                R: poi.location.R,
                lng: poi.location.lng,
                lat: poi.location.lat
            }
            this.infoWindow.open(this.map, center);
        }
    }
}
</script>
<style scoped>
    .container {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }

    .search-box {
        position: absolute;
        z-index: 5;
        width: 70%;
        left: 13%;
        top: 10px;
        height: 30px;
    }

    .city-input, .keywords-input, .btn {
        display: inline-block;
        height: 30px;
        margin-right: 5px;
    }

    .city-input, .keywords-input {
        width: 20%;
    }

    .search-box button {
        width: 10%;
        height: 100%;
        background: #30ccc1;
        border: 1px solid #30ccc1;
        color: #fff;
        outline: none;
    }

    .tip-box {
        width: 100%;
        max-height: 260px;
        position: absolute;
        top: 30px;
        overflow-y: auto;
        background-color: #fff;
    }
</style>