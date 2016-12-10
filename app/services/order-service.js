import Ember from 'ember';
const {Logger: {info}} = Ember;

export default Ember.Service.extend({
  currentOrder: undefined,

  init() {
    this._super(...arguments);

    this.reset();
  },

  reset() {
    this.set('currentOrder', []);
  },

  sendOrder() {
    info('Send order');
    this._applyOrder(this.get('currentOrder'));
    this.reset();
  },

  _applyOrder(order) {
    order.forEach(ticketProxy => {
      const ticket = ticketProxy.get('ticket');

      ticketProxy.get('items').forEach(({item}) => {
        ticket.get('items').pushObject(item);
      });

      ticket.save();
    });
  },

  addOrder(proxyTickets) {
    const currentOrder = this.get('currentOrder');

    proxyTickets.forEach(ticket => {
      let current = currentOrder.find(slice => slice.get('ticket.id') === ticket.get('id'));

      // add ticket if not already on order
      if (!current) {
        current = Ember.Object.create({ticket: ticket.get('content'), items: []});
        currentOrder.pushObject(current);
      }

      const items = current.get('items');

      // add item if not already on ticket
      let item = items.find(item => item.get('item.id') === ticket.get('item.id'));
      if (!item) {
        item = Ember.Object.create({item: ticket.item, count: 0});
        items.pushObject(item);
      }

      item.incrementProperty('count', parseInt(ticket.count));
    });
  },
});