<template>
	<div>
		<div class="goods">
			<div class="menu-wrapper" ref='menuWrapper'>
				<ul>
					<li v-for='(item,index) in goods' class="menu-item" :class="{'current':currentIndex===index}" @click='selectMenu(index,$event)'>
						<span class="text border-1px">
						<span v-show='item.type>0' class='icon' :class='classMap[item.type]'></span>{{item.name}}
						</span>
					</li>
				</ul>
			</div>
			<div class="foods-wrapper" ref='foodsWrapper'>
				<ul>
					<li v-for='item in goods' class="food-list food-list-hook">
						<h1 class="title">{{item.name}}</h1>
						<ul>
							<li @click="selectFood(food,$event)" v-for='food in item.foods' class="food-item">
								<div class="icon">
									<img width="57" height="57" :src="food.icon" alt="">
								</div>
								<div class="content">
									<h2 class="name">{{food.name}}</h2>
									<p class="desc">{{food.description}}</p>
									<div class="extra">
										<span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
									</div>
									<div class="price-wrapper">
										<price :food='food'></price>
									</div>
									<div class="cartcontrol-wrapper">
										<cartcontrol :food='food' @cart-add="cartAdd"></cartcontrol>
									</div>
								</div>
							</li>
						</ul>
					</li>
				</ul>
			</div>
			<shopcart ref="shopcart" :selectFoods="selectFoods" :deliveryPrice="seller.deliveryPrice" :minPrice="seller.minPrice"></shopcart>
		</div>
		<food :food="selectedFood" ref="showFood"></food>
	</div>
</template>

<script type="text/javascript">
	import axios from 'axios';
	import BScroll from 'better-scroll';
	import shopcart from '../../components/shopcart/shopcart'
	import cartcontrol from '../../components/cartcontrol/cartcontrol'
	import food from '../../components/food/food'
	import price from '../../components/price/price'

	export default{
		components: {
			shopcart,cartcontrol,food,price
		},
		props: {
			seller: {
				type: Object
			}
		},
		data() {
			return {
				goods: [],
				listHeight: [],//右侧渐进高度
				scrollY: 0,
				selectedFood: {}
			};
		},
		computed: {
			currentIndex() {
				for(let i=0;i<this.listHeight.length;i++){
					let height1=this.listHeight[i];
					let height2=this.listHeight[i+1];
					if(!height2 || (this.scrollY>=height1&&this.scrollY<height2)){
						return i;
					}
				}
				return 0;
			},
			selectFoods(){
				let foods=[];
				this.goods.forEach((good)=>{
					good.foods.forEach((food)=>{
						if(food.count){
							foods.push(food);
						}
					})
				})
				return foods;
			}
		},
		created() {
			this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];

			axios.get('http://localhost:8080/api/goods')
			.then(response=>{
				// console.log(response);
				this.goods=response.data.data;
				this.$nextTick(() => {//保证DOM已经被渲染了，这样才能正确计算menu和goods的高度
					this._initScroll();
					this._calculateHeight();
				});
			}) 
			.catch(error=>{
				alert('网络错误，不能访问');
			})
		},
		methods: {
			selectMenu(index,event) {
				if(!event._constructed) {//非自定义点击事件的情况下return掉，这样pc端就不会检测到两次点击事件。
					return;
				}
				// console.log(index);
				let foodList=this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');//获取的是一大类商品的list节点
				let el=foodList[index];
				this.foodsScroll.scrollToElement(el,1000);//滚动到该节点
			}, 
			selectFood(food,event) {
				if(!event._constructed){
					return;
				}
				this.selectedFood = food;
				this.$refs.showFood.show();
			},
			cartAdd(el) {
				//体验优化，异步执行下落动画，画面不容易卡顿。
				this.$nextTick(() => {
					this.$refs.shopcart.drop(el);
				});
			},
			_initScroll() {
				this.menuScroll = new BScroll(this.$refs.menuWrapper,{
					click: true //这样鼠标点击才能生效
				});
				this.foodsScroll = new BScroll(this.$refs.foodsWrapper,{
					click: true,
					probeType: 3//右侧滚动时，实时检测滚动的位置.
				});

				this.foodsScroll.on('scroll',(pos) => {
					this.scrollY = Math.abs(Math.round(pos.y));//scrollY取到了右侧滚动的高度，需要与左侧的索引做一个映射。
				});

			},
			_calculateHeight() {
				let foodList=this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');//获取的是一大类商品的list
				let height = 0;
				this.listHeight.push(height);
				for(let i=0;i<foodList.length;i++){
					height+=foodList[i].clientHeight;
					this.listHeight.push(height);
				}
			}
		}
	}
</script>

<style type="text/css" lang="stylus" rel="stylesheet/stylus">
	@import '../../common/stylus/mixin.styl'
	.goods {
		display: flex;
		position: absolute;
		top: 174px;
		bottom: 46px;
		width: 100%;
		overflow: hidden;
		.menu-wrapper {
			flex: 0 0 80px;
			width: 80px;
			background: #f3f5f7;
			.menu-item {
				display: table;
				width: 56px;
				height: 54px;
				line-height: 14px;
				padding: 0 12px;
				&.current {
					position: relative;
					margin-top: -1px;
					background: #fff;
					font-weight: 700;
					z-index: 10;
					.text {
						border-none();
					}
				}
				.text {
					display: table-cell;
					vertical-align: middle;
					border-1px(rgba(7,17,27,0.1));
					font-size: 12px;
					width: 56px;
					.icon {
					display: inline-block;
                    vertical-align: top;
                    width: 12px;
                    height: 12px;
                    margin-right: 2px;
                    background-size: 12px 12px;
                    background-repeat: no-repeat;
                    &.decrease {
                        bg-image('decrease_3');
                    }
                    &.discount {
                        bg-image('discount_3');
                    }
                    &.guarantee {
                        bg-image('guarantee_3');
                    }
                    &.invoice {
                        bg-image('invoice_3');
                    }
                    &.special {
                        bg-image('special_3');
                    }
					}
				}
			}
		}
		.foods-wrapper {
			flex: 1;
			.title {
				padding-left: 14px;
				font-size: 12px;
				height: 26px;
				line-height: 26px;
				color: rgb(147,153,159);
				border-left: 2px solid #d9dde1;
				background: #f3f5f7;
			}
			.food-item {
				display: flex;
				margin: 18px;
				padding-bottom: 18px;
				border-1px(rgba(7,17,27,0.1));
				&:last-child {
					border-none();
					margin-bottom: 0;
				}
				.icon {
					flex: 0 0 57px;
					margin-right: 10px;
				}
				.content {
					flex: 1;
					.name {
						margin: 2px 0 8px 0;
						height: 14px;
						line-height: 14px;
						font-size: 14px;
						color: rgb(7,17,27);
					}
					.desc,.extra {
						line-height: 10px;
						font-size: 10px;
						color: rgb(147,153,159);
					}
					.desc {
						line-height: 14px;
						margin-bottom: 8px;
					}
					.extra {
						.count {
							margin-right: 12px;
						}
					}
					.cartcontrol-wrapper {
						position: absolute;
						right: 0;
						bottom: 12px;
					}
				}
			}
		}
	}
</style>