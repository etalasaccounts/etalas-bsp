import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Create default admin user
  const hashedPassword = await bcrypt.hash('admin123', 12)
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@whatsappin.com' },
    update: {},
    create: {
      email: 'admin@whatsappin.com',
      name: 'Hilmi Arlugrah',
      password: hashedPassword,
      role: 'admin',
    },
  })

  console.log('👤 Admin user created:', adminUser.email)

  // Create default workspace
  const workspace = await prisma.workspace.upsert({
    where: { id: 'default-workspace' },
    update: {},
    create: {
      id: 'default-workspace',
      name: 'WhatsAppin Aja Workspace',
    },
  })

  console.log('🏢 Workspace created:', workspace.name)

  // Update admin user with workspace
  await prisma.user.update({
    where: { id: adminUser.id },
    data: { workspaceId: workspace.id },
  })

  // Create WhatsApp connection
  await prisma.whatsAppConnection.upsert({
    where: { id: 'default-connection' },
    update: {},
    create: {
      id: 'default-connection',
      name: 'WhatsAppin Aja Business',
      wabaId: '123456789',
      phoneNumber: '+6281234567890',
      accessToken: 'dummy-access-token',
      workspaceId: workspace.id,
    },
  })

  console.log('📱 WhatsApp connection created')

  // Create conversations with messages
  const conversations = [
    {
      id: 'conv-1',
      customerName: 'Waldemar Mannering',
      customerPhone: '+62812345678',
      status: 'open',
      messages: [
        { content: 'How can we help? We\'re here for you!', fromCustomer: false, createdAt: new Date(Date.now() - 60000 * 120) },
        { content: 'Hey, I am looking for the best admin template. Could you please help me to find it out?', fromCustomer: true, createdAt: new Date(Date.now() - 60000 * 110) },
        { content: 'It should be MUI v5 compatible.', fromCustomer: true, createdAt: new Date(Date.now() - 60000 * 109) },
        { content: 'Absolutely! This admin template is built with MUI!', fromCustomer: false, createdAt: new Date(Date.now() - 60000 * 90) },
        { content: 'Looks clean and fresh UI. 😍 It\'s perfect for my next project.', fromCustomer: true, createdAt: new Date(Date.now() - 60000 * 60) },
        { content: 'How can I purchase it?', fromCustomer: true, createdAt: new Date(Date.now() - 60000 * 59) },
        { content: 'Thanks, From our official site 😃', fromCustomer: false, createdAt: new Date(Date.now() - 60000 * 30) },
      ]
    },
    {
      id: 'conv-2',
      customerName: 'Felecia Rower',
      customerPhone: '+62812345679',
      status: 'open',
      messages: [
        { content: 'Hi! I\'m interested in your services.', fromCustomer: true, createdAt: new Date(Date.now() - 60000 * 480) },
        { content: 'Hello! Thank you for your interest. How can I help you today?', fromCustomer: false, createdAt: new Date(Date.now() - 60000 * 470) },
        { content: 'I need a custom dashboard for my business.', fromCustomer: true, createdAt: new Date(Date.now() - 60000 * 460) },
        { content: 'Great! We specialize in custom dashboards. What kind of business do you have?', fromCustomer: false, createdAt: new Date(Date.now() - 60000 * 450) },
        { content: 'I run a UX design agency and need analytics dashboard.', fromCustomer: true, createdAt: new Date(Date.now() - 60000 * 440) },
        { content: 'Perfect! We can definitely help with that. Let me prepare a proposal for you.', fromCustomer: false, createdAt: new Date(Date.now() - 60000 * 430) },
        { content: 'I will purchase it for sure. 👍', fromCustomer: true, createdAt: new Date(Date.now() - 60000 * 420) },
      ]
    },
    {
      id: 'conv-3',
      customerName: 'Calvin Moore',
      customerPhone: '+62812345680',
      status: 'pending',
      messages: [
        { content: 'Good morning! I saw your portfolio online.', fromCustomer: true, createdAt: new Date(Date.now() - 60000 * 1440) },
        { content: 'Good morning! Thank you for checking out our work. How can I assist you?', fromCustomer: false, createdAt: new Date(Date.now() - 60000 * 1430) },
        { content: 'I need a modern admin panel for my startup.', fromCustomer: true, createdAt: new Date(Date.now() - 60000 * 1420) },
        { content: 'That sounds exciting! What kind of startup are you building?', fromCustomer: false, createdAt: new Date(Date.now() - 60000 * 1410) },
        { content: 'It\'s a fintech app for small businesses.', fromCustomer: true, createdAt: new Date(Date.now() - 60000 * 1400) },
        { content: 'Interesting! We have experience with fintech dashboards. When do you need this completed?', fromCustomer: false, createdAt: new Date(Date.now() - 60000 * 1390) },
        { content: 'If it takes long you can mail me the details.', fromCustomer: true, createdAt: new Date(Date.now() - 60000 * 1380) },
      ]
    },
    {
      id: 'conv-4',
      customerName: 'Sarah Johnson',
      customerPhone: '+62812345681',
      status: 'open',
      messages: [
        { content: 'Hello! I need help with React development.', fromCustomer: true, createdAt: new Date(Date.now() - 60000 * 180) },
        { content: 'Hi Sarah! I\'d be happy to help with React. What specific area do you need assistance with?', fromCustomer: false, createdAt: new Date(Date.now() - 60000 * 170) },
        { content: 'I\'m struggling with state management in my app.', fromCustomer: true, createdAt: new Date(Date.now() - 60000 * 160) },
        { content: 'State management can be tricky! Are you using Redux, Zustand, or built-in React state?', fromCustomer: false, createdAt: new Date(Date.now() - 60000 * 150) },
        { content: 'Just using useState and useEffect, but it\'s getting messy.', fromCustomer: true, createdAt: new Date(Date.now() - 60000 * 140) },
        { content: 'I understand! For complex state, I\'d recommend looking into useReducer or a state management library.', fromCustomer: false, createdAt: new Date(Date.now() - 60000 * 130) },
        { content: 'That makes sense. Can you recommend any good tutorials?', fromCustomer: true, createdAt: new Date(Date.now() - 60000 * 120) },
        { content: 'Absolutely! I\'ll send you some great resources. 📚', fromCustomer: false, createdAt: new Date(Date.now() - 60000 * 110) },
      ]
    },
    {
      id: 'conv-5',
      customerName: 'Michael Chen',
      customerPhone: '+62812345682',
      status: 'closed',
      messages: [
        { content: 'Hi, I\'m looking for a freelance developer.', fromCustomer: true, createdAt: new Date(Date.now() - 60000 * 2880) },
        { content: 'Hello Michael! I\'m available for freelance work. What kind of project do you have in mind?', fromCustomer: false, createdAt: new Date(Date.now() - 60000 * 2870) },
        { content: 'I need an e-commerce website built from scratch.', fromCustomer: true, createdAt: new Date(Date.now() - 60000 * 2860) },
        { content: 'Great! I have experience building e-commerce sites. What platform would you prefer?', fromCustomer: false, createdAt: new Date(Date.now() - 60000 * 2850) },
        { content: 'I was thinking Next.js with Stripe integration.', fromCustomer: true, createdAt: new Date(Date.now() - 60000 * 2840) },
        { content: 'Perfect choice! Next.js with Stripe is a powerful combination. What\'s your timeline?', fromCustomer: false, createdAt: new Date(Date.now() - 60000 * 2830) },
        { content: 'I need it done in 6 weeks. Is that possible?', fromCustomer: true, createdAt: new Date(Date.now() - 60000 * 2820) },
        { content: 'Yes, that\'s definitely achievable! Let me prepare a detailed proposal for you.', fromCustomer: false, createdAt: new Date(Date.now() - 60000 * 2810) },
        { content: 'Sounds good! Looking forward to working with you.', fromCustomer: true, createdAt: new Date(Date.now() - 60000 * 2800) },
        { content: 'Thank you Michael! I\'ll send the proposal by tomorrow. 🚀', fromCustomer: false, createdAt: new Date(Date.now() - 60000 * 2790) },
      ]
    },
  ]

  console.log('💬 Creating conversations and messages...')

  for (const conv of conversations) {
    // Create conversation
    const conversation = await prisma.conversation.upsert({
      where: { id: conv.id },
      update: {},
      create: {
        id: conv.id,
        customerName: conv.customerName,
        customerPhone: conv.customerPhone,
        status: conv.status,
        workspaceId: workspace.id,
        assignedToId: adminUser.id,
      },
    })

    // Create messages for this conversation
    for (let index = 0; index < conv.messages.length; index++) {
      const msg = conv.messages[index]
      await prisma.message.upsert({
        where: { id: `${conv.id}-msg-${index + 1}` },
        update: {},
        create: {
          id: `${conv.id}-msg-${index + 1}`,
          content: msg.content,
          fromCustomer: msg.fromCustomer,
          conversationId: conversation.id,
          createdAt: msg.createdAt,
        },
      })
    }

    console.log(`✅ Created conversation: ${conv.customerName}`)
  }

  // Create some notifications
  const notifications = [
    {
      id: 'notif-1',
      message: 'New message from Waldemar Mannering',
      link: '/dashboard/chat',
      read: false,
      userId: adminUser.id,
    },
    {
      id: 'notif-2',
      message: 'Felecia Rower is interested in your services',
      link: '/dashboard/chat',
      read: false,
      userId: adminUser.id,
    },
    {
      id: 'notif-3',
      message: 'Calvin Moore sent a follow-up message',
      link: '/dashboard/chat',
      read: true,
      userId: adminUser.id,
    },
  ]

  for (const notif of notifications) {
    await prisma.notification.upsert({
      where: { id: notif.id },
      update: {},
      create: notif,
    })
  }

  console.log('🔔 Notifications created')

  console.log('🎉 Seed completed successfully!')
  console.log('\n📋 Summary:')
  console.log('- 1 Admin user created (admin@whatsappin.com / admin123)')
  console.log('- 1 Workspace created')
  console.log('- 1 WhatsApp connection created')
  console.log('- 5 Conversations created with messages')
  console.log('- 3 Notifications created')
  console.log('\n🚀 You can now login and see the conversations!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
