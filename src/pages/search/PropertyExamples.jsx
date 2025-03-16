// 房源数据示例
const propertyExamples = [
    {
      id: 1,
      title: "现代海景公寓，临近市中心",
      description: "宽敞明亮的两居室公寓，拥有令人惊叹的海景。步行即可到达热门景点和餐厅。",
      price: 188,
      currency: "¥",
      priceUnit: "晚",
      address: "上海市浦东新区",
      rating: 4.9,
      reviews: 128,
      isFavorite: false,
      listingType: "apartment",
      bedrooms: 2,
      bathrooms: 1,
      maxGuests: 4,
      amenities: ["wifi", "kitchen", "ac", "washer", "parking"],
      images: [
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
        "https://images.unsplash.com/photo-1586105251261-72a756497a11?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1558&q=80",
        "https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
      ],
      host: {
        name: "李明",
        image: "https://randomuser.me/api/portraits/men/32.jpg",
        isSuperhost: true
      },
      availability: {
        checkIn: "14:00",
        checkOut: "12:00",
        minStay: 2
      }
    },
    {
      id: 2,
      title: "田园风格独栋别墅，带私人花园",
      description: "远离城市喧嚣的乡村别墅，带有精心打理的花园和户外烧烤区。理想的周末度假选择。",
      price: 458,
      currency: "¥",
      priceUnit: "晚",
      address: "杭州市临安区",
      rating: 4.8,
      reviews: 86,
      isFavorite: true,
      listingType: "villa",
      bedrooms: 3,
      bathrooms: 2,
      maxGuests: 6,
      amenities: ["wifi", "kitchen", "ac", "washer", "pool", "parking"],
      images: [
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
      ],
      host: {
        name: "张芳",
        image: "https://randomuser.me/api/portraits/women/44.jpg",
        isSuperhost: true
      },
      availability: {
        checkIn: "15:00",
        checkOut: "11:00",
        minStay: 2
      }
    },
    {
      id: 3,
      title: "现代简约工作室，邻近地铁站",
      description: "适合商务旅行的小巧工作室，配有高速WiFi和工作区域。地铁站步行仅需3分钟。",
      price: 129,
      currency: "¥",
      priceUnit: "晚",
      address: "北京市朝阳区",
      rating: 4.6,
      reviews: 42,
      isFavorite: false,
      listingType: "apartment",
      bedrooms: 1,
      bathrooms: 1,
      maxGuests: 2,
      amenities: ["wifi", "kitchen", "ac", "washer"],
      images: [
        "https://images.unsplash.com/photo-1536674911910-c0ebfd6c2cd6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
        "https://images.unsplash.com/photo-1630699144867-37acec97df5a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
        "https://images.unsplash.com/photo-1594484208280-efa00f96fc21?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
      ],
      host: {
        name: "王强",
        image: "https://randomuser.me/api/portraits/men/67.jpg",
        isSuperhost: false
      },
      availability: {
        checkIn: "14:00",
        checkOut: "12:00",
        minStay: 1
      }
    },
    {
      id: 4,
      title: "传统中式四合院，体验京城文化",
      description: "百年四合院，完美保留传统建筑风格，同时配备现代化设施。感受老北京的文化底蕴。",
      price: 798,
      currency: "¥",
      priceUnit: "晚",
      address: "北京市东城区",
      rating: 4.9,
      reviews: 219,
      isFavorite: false,
      listingType: "house",
      bedrooms: 4,
      bathrooms: 2,
      maxGuests: 8,
      amenities: ["wifi", "kitchen", "ac", "washer", "parking"],
      images: [
        "https://images.unsplash.com/photo-1577058509942-9738e552ac85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
        "https://images.unsplash.com/photo-1565182999561-18d7dc61c393?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
        "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
      ],
      host: {
        name: "赵雅文",
        image: "https://randomuser.me/api/portraits/women/22.jpg",
        isSuperhost: true
      },
      availability: {
        checkIn: "15:00",
        checkOut: "11:00",
        minStay: 3
      }
    },
    {
      id: 5,
      title: "山顶小木屋，俯瞰城市美景",
      description: "位于山顶的精致小木屋，白天可以欣赏山景，夜晚可以俯瞰整个城市的灯光。",
      price: 368,
      currency: "¥",
      priceUnit: "晚",
      address: "重庆市南岸区",
      rating: 4.7,
      reviews: 94,
      isFavorite: true,
      listingType: "cabin",
      bedrooms: 2,
      bathrooms: 1,
      maxGuests: 4,
      amenities: ["wifi", "kitchen", "ac", "parking"],
      images: [
        "https://images.unsplash.com/photo-1586375300773-8384e3e4916f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
        "https://images.unsplash.com/photo-1539437829697-1b4ed5aebd19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
        "https://images.unsplash.com/photo-1616248304589-6a3d8d60ad7d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
      ],
      host: {
        name: "陈军",
        image: "https://randomuser.me/api/portraits/men/78.jpg",
        isSuperhost: false
      },
      availability: {
        checkIn: "15:00",
        checkOut: "10:00",
        minStay: 2
      }
    },
    {
      id: 6,
      title: "湖畔度假别墅，带私人码头",
      description: "坐落在湖边的豪华别墅，拥有私人码头和露台。可以在湖中游泳、划船或钓鱼。",
      price: 1280,
      currency: "¥",
      priceUnit: "晚",
      address: "苏州市吴中区",
      rating: 4.9,
      reviews: 156,
      isFavorite: false,
      listingType: "villa",
      bedrooms: 5,
      bathrooms: 3,
      maxGuests: 10,
      amenities: ["wifi", "kitchen", "ac", "washer", "pool", "parking"],
      images: [
        "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
        "https://images.unsplash.com/photo-1523217582562-09d0def993a6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
        "https://images.unsplash.com/photo-1560185009-5bf9f2849488?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
      ],
      host: {
        name: "林小琴",
        image: "https://randomuser.me/api/portraits/women/36.jpg",
        isSuperhost: true
      },
      availability: {
        checkIn: "16:00",
        checkOut: "11:00",
        minStay: 3
      }
    }
  ];
  
  export default propertyExamples;