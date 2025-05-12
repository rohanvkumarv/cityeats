const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // Clean up existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.table.deleteMany();
  await prisma.restaurantImage.deleteMany();
  await prisma.restaurant.deleteMany();
  await prisma.vendor.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.user.deleteMany();

  console.log('Database cleaned. Creating new data...');

  // Hash for password "password123"
  const passwordHash = await bcrypt.hash('password123', 10);

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@citieats.com',
      password: passwordHash,
      type: 'ADMIN',
    },
  });
  console.log(`Created admin user: ${admin.email}`);

  // Create customer users
  const customer1 = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      password: passwordHash,
      type: 'CUSTOMER',
      phone: '555-123-4567',
      cart: {
        create: {}
      },
      wishlist: {
        create: {}
      }
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: passwordHash,
      type: 'CUSTOMER',
      phone: '555-987-6543',
      cart: {
        create: {}
      },
      wishlist: {
        create: {}
      }
    },
  });
  console.log(`Created customer users`);

  // Create vendor users and restaurants
  const restaurants = [
    {
      vendorName: 'Mario Rossi',
      vendorEmail: 'mario@italiandelight.com',
      vendorPhone: '555-111-2222',
      storeName: 'Italian Delight',
      description: 'Authentic Italian cuisine in a cozy atmosphere. Our pastas are made fresh daily and our pizzas are baked in a traditional wood-fired oven.',
      address: '123 Main Street',
      city: 'New York',
      cuisine: ['Italian', 'Mediterranean'],
      openingHours: '11:00',
      closingHours: '22:00',
      hasAC: true,
      hasRooftop: false,
      hasWifi: true,
      hasParking: false,
      isOpen: true,
      rating: 4.7,
      tables: [
        { tableNumber: 1, capacity: 2, type: 'INDOOR', hasAC: true },
        { tableNumber: 2, capacity: 4, type: 'INDOOR', hasAC: true },
        { tableNumber: 3, capacity: 6, type: 'INDOOR', hasAC: true },
      ],
      menuCategories: {
        'Starters': [
          { name: 'Bruschetta', description: 'Toasted bread topped with tomatoes, garlic, and basil', price: 8.99 },
          { name: 'Caprese Salad', description: 'Fresh mozzarella, tomatoes, and basil drizzled with balsamic glaze', price: 10.99 },
        ],
        'Pasta': [
          { name: 'Spaghetti Carbonara', description: 'Classic pasta with eggs, cheese, pancetta, and black pepper', price: 14.99 },
          { name: 'Fettuccine Alfredo', description: 'Fettuccine pasta in rich cream sauce with parmesan cheese', price: 13.99 },
          { name: 'Lasagna', description: 'Layers of pasta, meat sauce, and cheese baked to perfection', price: 15.99 },
        ],
        'Pizza': [
          { name: 'Margherita', description: 'Classic pizza with tomato sauce, mozzarella, and basil', price: 12.99 },
          { name: 'Pepperoni', description: 'Tomato sauce, mozzarella, and pepperoni', price: 14.99 },
          { name: 'Quattro Formaggi', description: 'Four cheese pizza with mozzarella, gorgonzola, fontina, and parmesan', price: 16.99 },
        ],
        'Desserts': [
          { name: 'Tiramisu', description: 'Classic Italian dessert with coffee, mascarpone, and cocoa', price: 7.99 },
          { name: 'Panna Cotta', description: 'Italian custard with berry coulis', price: 6.99 },
        ],
      },
      images: [
        { imageUrl: '/images/restaurants/italian-delight-1.jpg', isMain: true },
        { imageUrl: '/images/restaurants/italian-delight-2.jpg', isMain: false },
      ]
    },
    {
      vendorName: 'Chen Wei',
      vendorEmail: 'chen@goldenpanda.com',
      vendorPhone: '555-333-4444',
      storeName: 'Golden Panda',
      description: 'Serving the finest Chinese cuisine with flavors from various regions of China. Our chef specializes in Szechuan and Cantonese dishes.',
      address: '456 Oak Avenue',
      city: 'Los Angeles',
      cuisine: ['Chinese', 'Asian'],
      openingHours: '12:00',
      closingHours: '23:00',
      hasAC: true,
      hasRooftop: false,
      hasWifi: true,
      hasParking: true,
      isOpen: true,
      rating: 4.5,
      tables: [
        { tableNumber: 1, capacity: 2, type: 'INDOOR', hasAC: true },
        { tableNumber: 2, capacity: 4, type: 'INDOOR', hasAC: true },
        { tableNumber: 3, capacity: 8, type: 'INDOOR', hasAC: true },
      ],
      menuCategories: {
        'Appetizers': [
          { name: 'Spring Rolls', description: 'Crispy rolls filled with vegetables and served with sweet chili sauce', price: 6.99 },
          { name: 'Dumplings', description: 'Steamed dumplings filled with pork and vegetables', price: 8.99 },
        ],
        'Soups': [
          { name: 'Hot & Sour Soup', description: 'Traditional spicy and tangy soup with tofu and mushrooms', price: 5.99 },
          { name: 'Wonton Soup', description: 'Clear broth with pork-filled wontons and green onions', price: 5.99 },
        ],
        'Main Courses': [
          { name: 'Kung Pao Chicken', description: 'Spicy stir-fried chicken with peanuts, vegetables, and chili peppers', price: 15.99 },
          { name: 'Beef with Broccoli', description: 'Tender beef and broccoli in savory sauce', price: 16.99 },
          { name: 'General Tso\'s Chicken', description: 'Sweet and spicy deep-fried chicken', price: 14.99 },
          { name: 'Mapo Tofu', description: 'Spicy tofu dish with minced meat and Sichuan peppercorns', price: 13.99 },
        ],
        'Noodles & Rice': [
          { name: 'Vegetable Chow Mein', description: 'Stir-fried noodles with mixed vegetables', price: 11.99 },
          { name: 'Special Fried Rice', description: 'Fried rice with shrimp, chicken, and vegetables', price: 12.99 },
        ],
      },
      images: [
        { imageUrl: '/images/restaurants/golden-panda-1.jpg', isMain: true },
        { imageUrl: '/images/restaurants/golden-panda-2.jpg', isMain: false },
      ]
    },
    {
      vendorName: 'Rajesh Kumar',
      vendorEmail: 'rajesh@tajmahal.com',
      vendorPhone: '555-555-6666',
      storeName: 'Taj Mahal',
      description: 'Experience the rich flavors of Indian cuisine with our authentic dishes prepared with traditional spices and cooking methods.',
      address: '789 Spice Lane',
      city: 'Chicago',
      cuisine: ['Indian', 'Vegetarian'],
      openingHours: '12:00',
      closingHours: '22:30',
      hasAC: true,
      hasRooftop: true,
      hasWifi: true,
      hasParking: true,
      isOpen: true,
      rating: 4.8,
      tables: [
        { tableNumber: 1, capacity: 2, type: 'INDOOR', hasAC: true },
        { tableNumber: 2, capacity: 4, type: 'INDOOR', hasAC: true },
        { tableNumber: 3, capacity: 6, type: 'ROOFTOP', hasAC: false },
        { tableNumber: 4, capacity: 8, type: 'ROOFTOP', hasAC: false },
      ],
      menuCategories: {
        'Appetizers': [
          { name: 'Samosas', description: 'Crispy pastry filled with spiced potatoes and peas', price: 7.99 },
          { name: 'Pakoras', description: 'Vegetable fritters made with chickpea flour', price: 6.99 },
        ],
        'Tandoori Specials': [
          { name: 'Tandoori Chicken', description: 'Chicken marinated in yogurt and spices, cooked in clay oven', price: 16.99 },
          { name: 'Seekh Kebab', description: 'Minced meat skewers with herbs and spices', price: 15.99 },
        ],
        'Curries': [
          { name: 'Butter Chicken', description: 'Tender chicken in a rich, buttery tomato sauce', price: 17.99 },
          { name: 'Palak Paneer', description: 'Cottage cheese cubes in creamy spinach sauce', price: 14.99 },
          { name: 'Chana Masala', description: 'Chickpeas in a spicy tomato sauce', price: 13.99 },
          { name: 'Lamb Rogan Josh', description: 'Tender lamb in aromatic Kashmiri spices', price: 18.99 },
        ],
        'Breads & Rice': [
          { name: 'Naan', description: 'Traditional leavened flatbread', price: 3.99 },
          { name: 'Garlic Naan', description: 'Naan bread with garlic and herbs', price: 4.99 },
          { name: 'Biryani', description: 'Fragrant rice dish with vegetables or meat', price: 15.99 },
        ],
        'Desserts': [
          { name: 'Gulab Jamun', description: 'Sweet milk balls soaked in rose syrup', price: 5.99 },
          { name: 'Kheer', description: 'Rice pudding with cardamom and nuts', price: 5.99 },
        ],
      },
      images: [
        { imageUrl: '/images/restaurants/taj-mahal-1.jpg', isMain: true },
        { imageUrl: '/images/restaurants/taj-mahal-2.jpg', isMain: false },
      ]
    },
    {
      vendorName: 'Miguel Rodriguez',
      vendorEmail: 'miguel@elscantina.com',
      vendorPhone: '555-777-8888',
      storeName: 'El Sombrero',
      description: 'Authentic Mexican cuisine with recipes passed down through generations. Our tacos and enchiladas are made with fresh ingredients and traditional spices.',
      address: '101 Fiesta Street',
      city: 'Houston',
      cuisine: ['Mexican', 'Latin American'],
      openingHours: '11:30',
      closingHours: '23:00',
      hasAC: true,
      hasRooftop: false,
      hasWifi: true,
      hasParking: true,
      isOpen: true,
      rating: 4.6,
      tables: [
        { tableNumber: 1, capacity: 2, type: 'INDOOR', hasAC: true },
        { tableNumber: 2, capacity: 4, type: 'INDOOR', hasAC: true },
        { tableNumber: 3, capacity: 6, type: 'INDOOR', hasAC: true },
      ],
      menuCategories: {
        'Starters': [
          { name: 'Guacamole & Chips', description: 'Fresh guacamole with homemade tortilla chips', price: 8.99 },
          { name: 'Queso Fundido', description: 'Melted cheese with chorizo and peppers', price: 9.99 },
        ],
        'Tacos': [
          { name: 'Carne Asada Tacos', description: 'Grilled steak tacos with onions and cilantro', price: 12.99 },
          { name: 'Fish Tacos', description: 'Battered fish with cabbage slaw and lime crema', price: 13.99 },
          { name: 'Vegetarian Tacos', description: 'Roasted vegetables with black beans and avocado', price: 11.99 },
        ],
        'Entrees': [
          { name: 'Enchiladas', description: 'Corn tortillas filled with chicken and topped with red sauce', price: 14.99 },
          { name: 'Chiles Rellenos', description: 'Stuffed poblano peppers with rice and beans', price: 15.99 },
          { name: 'Fajitas', description: 'Sizzling plate with grilled meat, peppers, and onions', price: 18.99 },
        ],
        'Sides': [
          { name: 'Mexican Rice', description: 'Tomato-infused rice with vegetables', price: 3.99 },
          { name: 'Refried Beans', description: 'Traditional Mexican beans with cheese', price: 3.99 },
        ],
        'Desserts': [
          { name: 'Churros', description: 'Fried dough pastry with cinnamon sugar and chocolate dip', price: 6.99 },
          { name: 'Tres Leches Cake', description: 'Sponge cake soaked in three kinds of milk', price: 7.99 },
        ],
      },
      images: [
        { imageUrl: '/images/restaurants/el-sombrero-1.jpg', isMain: true },
        { imageUrl: '/images/restaurants/el-sombrero-2.jpg', isMain: false },
      ]
    }
  ];
  
  // Create vendors and their restaurants
  for (const restaurant of restaurants) {
    // Create vendor user
    const vendor = await prisma.user.create({
      data: {
        name: restaurant.vendorName,
        email: restaurant.vendorEmail,
        password: passwordHash,
        type: 'VENDOR',
        phone: restaurant.vendorPhone,
      },
    });
    
    // Create vendor profile
    const vendorProfile = await prisma.vendor.create({
      data: {
        userId: vendor.id,
        storeName: restaurant.storeName,
        status: 'APPROVED',
      },
    });
    
    // Create restaurant
    const restaurantRecord = await prisma.restaurant.create({
      data: {
        vendorId: vendorProfile.id,
        name: restaurant.storeName,
        description: restaurant.description,
        address: restaurant.address,
        city: restaurant.city,
        cuisine: restaurant.cuisine,
        openingHours: restaurant.openingHours,
        closingHours: restaurant.closingHours,
        hasAC: restaurant.hasAC,
        hasRooftop: restaurant.hasRooftop,
        hasWifi: restaurant.hasWifi,
        hasParking: restaurant.hasParking,
        isOpen: restaurant.isOpen,
        rating: restaurant.rating,
      },
    });
    
    // Create restaurant images
    for (const image of restaurant.images) {
      await prisma.restaurantImage.create({
        data: {
          restaurantId: restaurantRecord.id,
          imageUrl: image.imageUrl,
          isMain: image.isMain,
        },
      });
    }
    
    // Create tables
    for (const table of restaurant.tables) {
      await prisma.table.create({
        data: {
          restaurantId: restaurantRecord.id,
          tableNumber: table.tableNumber,
          capacity: table.capacity,
          type: table.type,
          hasAC: table.hasAC,
          isAvailable: true,
        },
      });
    }
    
    // Create menu items by category
    for (const [category, items] of Object.entries(restaurant.menuCategories)) {
      for (const item of items) {
        await prisma.menuItem.create({
          data: {
            restaurantId: restaurantRecord.id,
            name: item.name,
            description: item.description,
            price: item.price,
            category: category,
            isAvailable: true,
          },
        });
      }
    }
    
    console.log(`Created restaurant: ${restaurant.storeName}`);
  }

  // Create some sample bookings
  const italiandDelightRestaurant = await prisma.restaurant.findFirst({
    where: { name: 'Italian Delight' },
    include: {
      tables: true,
    },
  });

  const johnDoeUser = await prisma.user.findUnique({
    where: { email: 'john@example.com' },
  });

  // Create a booking for tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  await prisma.booking.create({
    data: {
      userId: johnDoeUser.id,
      restaurantId: italiandDelightRestaurant.id,
      tableId: italiandDelightRestaurant.tables[0].id,
      date: tomorrow,
      time: '19:00',
      people: 2,
      status: 'CONFIRMED',
      specialRequests: 'Anniversary dinner, would like a quiet table',
    },
  });

  console.log('Sample bookings created');
  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });