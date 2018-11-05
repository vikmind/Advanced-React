const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Mutation = {
  async createItem(parent, args, ctx, info) {
    // TODO: Check if they are logged in

    const item = await ctx.db.mutation.createItem({
      data: {
        ...args,
      },
    }, info);

    return item;
  },
  async updateItem(parent, args, ctx, info) {
    const updates = { ...args };
    delete updates.id;
    const item = await ctx.db.mutation.updateItem({
      data: updates,
      where: { id: args.id },
    }, info);
    return item;
  },
  async deleteItem(parent, args, ctx, info) {
    const where = { id: args.id }
    // 1. Find
    const item = await ctx.db.query.item({ where }, `{ id title }`)
    // 2. Check permissions
    // 3. Delete
    return ctx.db.mutation.deleteItem({
      where,
    }, info);
  },
  async signup(parent, args, ctx, info) {
    const email = args.email.toLowerCase();
    const password = await bcrypt.hash(args.password, 10);
    const user = await ctx.db.mutation.createUser({ data: {
      ...args,
      email,
      password,
      permissions: { set: ['USER'] },
    }}, info);
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365,
    });
    return user;
  },
};

module.exports = Mutation;
