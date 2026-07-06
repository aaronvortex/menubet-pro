import { MenuCategory } from '../types/menu'
import { ServiceItem } from '../types/service'

export const serviceCategories: MenuCategory[] = [
  { id: 'laundry', name: 'Laundry', icon: '🧺', display_order: 1 },
  { id: 'housekeeping', name: 'Housekeeping', icon: '🛏️', display_order: 2 },
  { id: 'spa', name: 'Spa', icon: '💆', display_order: 3 },
  { id: 'maintenance', name: 'Maintenance', icon: '🔧', display_order: 4 },
]

export const serviceActionLabels: Record<string, string> = {
  laundry: 'Order',
  housekeeping: 'Request',
  spa: 'Book',
  maintenance: 'Report',
}

export const serviceCategoryStyles: Record<string, { gradient: string }> = {
  laundry: { gradient: 'from-cyan-400 to-blue-600' },
  housekeeping: { gradient: 'from-violet-400 to-purple-600' },
  spa: { gradient: 'from-emerald-400 to-teal-600' },
  maintenance: { gradient: 'from-amber-400 to-orange-600' },
}

const pexels = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=600`

export const serviceItems: ServiceItem[] = [
  { id: 'laundry-001', categoryId: 'laundry', name: 'Wash & Fold', description: 'Professional washing and folding for your everyday garments, returned fresh and neatly packed.', price: 150, icon: '🧺', image: pexels(4959879), estimatedTime: 'Ready in 4 hours', notes: 'Please place items in the provided laundry bag.', available: true },
  { id: 'laundry-002', categoryId: 'laundry', name: 'Dry Cleaning', description: 'Gentle dry cleaning for delicate fabrics, suits and formal wear by our expert staff.', price: 250, icon: '👔', image: pexels(17663072), estimatedTime: 'Ready in 24 hours', notes: 'Delicate and formal wear only.', available: true },
  { id: 'laundry-003', categoryId: 'laundry', name: 'Ironing', description: 'Crisp, wrinkle-free pressing for shirts, trousers and dresses ready to wear.', price: 80, icon: '👕', image: pexels(10558201), estimatedTime: 'Ready in 2 hours', notes: 'Best for shirts, trousers and light fabrics.', available: true },
  { id: 'laundry-004', categoryId: 'laundry', name: 'Express Laundry', description: 'Priority same-day laundry service for guests who need it back in a hurry.', price: 350, icon: '⚡', image: pexels(4993073), estimatedTime: 'Ready in 90 minutes', notes: 'Priority service, limited daily slots.', available: true },

  { id: 'housekeeping-001', categoryId: 'housekeeping', name: 'Room Cleaning', description: 'A thorough refresh of your room — bed, bathroom and floors — anytime you need it.', icon: '🧹', image: pexels(29006838), estimatedTime: 'Within 30 minutes', notes: "Please hang the Do Not Disturb sign if you'd like to reschedule.", available: true },
  { id: 'housekeeping-002', categoryId: 'housekeeping', name: 'Extra Towels', description: 'Fresh bath and hand towels delivered straight to your room.', icon: '🛁', image: pexels(1304110), estimatedTime: 'Within 15 minutes', available: true },
  { id: 'housekeeping-003', categoryId: 'housekeeping', name: 'Extra Pillows', description: 'Additional soft pillows for extra comfort during your stay.', icon: '🛌', image: pexels(3682240), estimatedTime: 'Within 15 minutes', available: true },
  { id: 'housekeeping-004', categoryId: 'housekeeping', name: 'Extra Blanket', description: 'A warm extra blanket delivered to keep your room cozy.', icon: '🧣', image: pexels(5629134), estimatedTime: 'Within 15 minutes', available: true },
  { id: 'housekeeping-005', categoryId: 'housekeeping', name: 'Water Bottles', description: 'Chilled bottled water delivered to your room on request.', icon: '💧', image: pexels(11860560), estimatedTime: 'Within 15 minutes', available: true },

  { id: 'spa-001', categoryId: 'spa', name: 'Swedish Massage', description: 'A relaxing full-body massage using gentle, flowing strokes to ease tension.', price: 900, icon: '🌿', image: pexels(19695969), estimatedTime: '60 minute session', notes: 'Please arrive 10 minutes early to change.', available: true },
  { id: 'spa-002', categoryId: 'spa', name: 'Deep Tissue Massage', description: 'Targeted deep-pressure massage to relieve chronic muscle tightness and stress.', price: 1100, icon: '💪', estimatedTime: '60 minute session', notes: 'Let your therapist know of any problem areas.', available: true },
  { id: 'spa-003', categoryId: 'spa', name: 'Facial', description: 'A rejuvenating facial treatment to cleanse, refresh and hydrate your skin.', price: 700, icon: '🧖', image: pexels(3985329), estimatedTime: '45 minute session', notes: 'Please remove makeup before your appointment.', available: true },
  { id: 'spa-004', categoryId: 'spa', name: 'Sauna', description: 'Private sauna session to unwind, detoxify and soothe tired muscles.', price: 400, icon: '♨️', image: pexels(8092430), estimatedTime: '30 minute session', notes: 'Towels and water are provided.', available: true },

  { id: 'maintenance-001', categoryId: 'maintenance', name: 'Air Conditioner', description: "Report an issue with your room's air conditioning or temperature control.", icon: '❄️', image: pexels(16592625), estimatedTime: 'Response within 1 hour', available: true },
  { id: 'maintenance-002', categoryId: 'maintenance', name: 'TV Repair', description: 'Report a problem with your in-room television or entertainment system.', icon: '📺', image: pexels(31718639), estimatedTime: 'Response within 1 hour', available: true },
  { id: 'maintenance-003', categoryId: 'maintenance', name: 'Hot Water', description: 'Report an issue with hot water supply in your bathroom.', icon: '🚿', image: pexels(161502), estimatedTime: 'Response within 1 hour', available: true },
  { id: 'maintenance-004', categoryId: 'maintenance', name: 'Plumbing', description: 'Report a leak, clog or any plumbing issue in your room.', icon: '🚰', estimatedTime: 'Response within 1 hour', available: true },
  { id: 'maintenance-005', categoryId: 'maintenance', name: 'Electricity', description: 'Report a power outlet, lighting or electrical issue in your room.', icon: '⚡', image: pexels(257736), estimatedTime: 'Response within 1 hour', notes: 'For safety, please avoid touching any exposed wiring.', available: true },
]
