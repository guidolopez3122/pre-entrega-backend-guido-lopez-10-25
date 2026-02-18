import Ticket from '../models/Ticket.js';
import { TicketDTO } from '../dto/ticket.dto.js';

export class TicketService {
  async createTicket(ticketData) {
    try {
      // Generar código único
      const code = this.generateTicketCode();
      
      const ticket = await Ticket.create({
        code,
        purchase_datetime: new Date(),
        amount: ticketData.amount,
        purchaser: ticketData.purchaser,
        products: ticketData.products
      });

      return new TicketDTO(ticket);
    } catch (error) {
      throw new Error(`Error al crear ticket: ${error.message}`);
    }
  }

  async getTicketById(id) {
    try {
      const ticket = await Ticket.findById(id).populate('products.product');
      if (!ticket) {
        throw new Error('Ticket no encontrado');
      }
      return new TicketDTO(ticket);
    } catch (error) {
      throw new Error(`Error al obtener ticket: ${error.message}`);
    }
  }

  async getTicketsByUser(userId) {
    try {
      const tickets = await Ticket.find({ purchaser: userId }).populate('products.product');
      return tickets.map(ticket => new TicketDTO(ticket));
    } catch (error) {
      throw new Error(`Error al obtener tickets: ${error.message}`);
    }
  }

  generateTicketCode() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 11).toUpperCase();
    return `TICKET-${timestamp}-${random}`;
  }
}

export default new TicketService();
