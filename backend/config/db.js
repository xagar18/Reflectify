import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const { Pool } = pg;

// Parse the connection string manually
const connectionString = process.env.DATABASE_URL;

const url = new URL(connectionString);

const pool = new Pool({
  host: url.hostname,
  port: parseInt(url.port),
  database: url.pathname.slice(1), // Remove leading slash
  user: url.username,
  password: url.password,
  ssl: { rejectUnauthorized: false },
});

// Database wrapper that mimics Prisma interface
const db = {
  user: {
    findFirst: async (options) => {
      const { where } = options;
      let query = 'SELECT * FROM "User"';
      const values = [];
      let conditions = [];

      if (where) {
        if (where.email) {
          conditions.push('"email" = $' + (values.length + 1));
          values.push(where.email);
        }
        if (where.id) {
          conditions.push('"id" = $' + (values.length + 1));
          values.push(where.id);
        }
        if (where.verificationToken) {
          conditions.push('"verificationToken" = $' + (values.length + 1));
          values.push(where.verificationToken);
        }
        if (where.resetPasswordToken) {
          conditions.push('"resetPasswordToken" = $' + (values.length + 1));
          values.push(where.resetPasswordToken);
        }
      }

      if (conditions.length > 0) {
        query += " WHERE " + conditions.join(" AND ");
      }

      query += " LIMIT 1";

      const result = await pool.query(query, values);
      return result.rows[0] || null;
    },

    create: async (options) => {
      const { data } = options;
      const fields = Object.keys(data);
      const values = Object.values(data);
      const placeholders = fields.map((_, i) => "$" + (i + 1));

      const query = `INSERT INTO "User" (${fields.map((f) => `"${f}"`).join(", ")}) VALUES (${placeholders.join(", ")}) RETURNING *`;

      const result = await pool.query(query, values);
      return result.rows[0];
    },

    update: async (options) => {
      const { where, data } = options;
      const setFields = Object.keys(data);
      const values = Object.values(data);
      let conditions = [];

      const setClause = setFields
        .map((field, i) => `"${field}" = $${i + 1}`)
        .join(", ");

      if (where) {
        if (where.id) {
          conditions.push(`"id" = $${values.length + 1}`);
          values.push(where.id);
        }
        if (where.email) {
          conditions.push(`"email" = $${values.length + 1}`);
          values.push(where.email);
        }
      }

      const query = `UPDATE "User" SET ${setClause} WHERE ${conditions.join(" AND ")} RETURNING *`;

      const result = await pool.query(query, values);
      return result.rows[0];
    },
  },

  conversation: {
    findMany: async (options) => {
      const { where, orderBy, include } = options || {};
      let query = 'SELECT * FROM "Conversation"';
      const values = [];
      let conditions = [];

      if (where) {
        if (where.userId) {
          conditions.push('"userId" = $' + (values.length + 1));
          values.push(where.userId);
        }
      }

      if (conditions.length > 0) {
        query += " WHERE " + conditions.join(" AND ");
      }

      if (orderBy) {
        if (orderBy.updatedAt === "desc") {
          query += ' ORDER BY "updatedAt" DESC';
        } else if (orderBy.createdAt === "desc") {
          query += ' ORDER BY "createdAt" DESC';
        } else if (orderBy.createdAt === "asc") {
          query += ' ORDER BY "createdAt" ASC';
        }
      }

      const result = await pool.query(query, values);
      const conversations = result.rows;

      // Handle include for messages
      if (include && include.messages) {
        for (const conv of conversations) {
          let msgQuery = 'SELECT * FROM "Message" WHERE "conversationId" = $1';
          if (include.messages.orderBy) {
            if (include.messages.orderBy.createdAt === "asc") {
              msgQuery += ' ORDER BY "createdAt" ASC';
            } else if (include.messages.orderBy.createdAt === "desc") {
              msgQuery += ' ORDER BY "createdAt" DESC';
            }
          }
          const msgResult = await pool.query(msgQuery, [conv.id]);
          conv.messages = msgResult.rows;
        }
      }

      return conversations;
    },

    create: async (options) => {
      const { data, include } = options;

      // Generate a unique ID if not provided
      const id =
        data.id ||
        `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const now = new Date();

      const insertData = {
        id,
        userId: data.userId,
        title: data.title || "New Reflection",
        createdAt: now,
        updatedAt: now,
      };

      const fields = Object.keys(insertData);
      const values = Object.values(insertData);
      const placeholders = fields.map((_, i) => "$" + (i + 1));

      const query = `INSERT INTO "Conversation" (${fields.map((f) => `"${f}"`).join(", ")}) VALUES (${placeholders.join(", ")}) RETURNING *`;

      const result = await pool.query(query, values);
      const conversation = result.rows[0];

      // Handle include for messages
      if (include && include.messages) {
        conversation.messages = [];
      }

      return conversation;
    },

    findFirst: async (options) => {
      const { where, include } = options;
      let query = 'SELECT * FROM "Conversation"';
      const values = [];
      let conditions = [];

      if (where) {
        if (where.id) {
          conditions.push('"id" = $' + (values.length + 1));
          values.push(where.id);
        }
        if (where.userId) {
          conditions.push('"userId" = $' + (values.length + 1));
          values.push(where.userId);
        }
      }

      if (conditions.length > 0) {
        query += " WHERE " + conditions.join(" AND ");
      }

      query += " LIMIT 1";

      const result = await pool.query(query, values);
      const conversation = result.rows[0] || null;

      // Handle include for messages
      if (conversation && include && include.messages) {
        let msgQuery = 'SELECT * FROM "Message" WHERE "conversationId" = $1';
        if (include.messages.orderBy) {
          if (include.messages.orderBy.createdAt === "asc") {
            msgQuery += ' ORDER BY "createdAt" ASC';
          } else if (include.messages.orderBy.createdAt === "desc") {
            msgQuery += ' ORDER BY "createdAt" DESC';
          }
        }
        const msgResult = await pool.query(msgQuery, [conversation.id]);
        conversation.messages = msgResult.rows;
      }

      return conversation;
    },

    update: async (options) => {
      const { where, data } = options;
      const setFields = Object.keys(data);
      const values = Object.values(data);
      let conditions = [];

      const setClause = setFields
        .map((field, i) => `"${field}" = $${i + 1}`)
        .join(", ");

      if (where) {
        if (where.id) {
          conditions.push(`"id" = $${values.length + 1}`);
          values.push(where.id);
        }
      }

      const query = `UPDATE "Conversation" SET ${setClause} WHERE ${conditions.join(" AND ")} RETURNING *`;

      const result = await pool.query(query, values);
      return result.rows[0];
    },

    delete: async (options) => {
      const { where } = options;
      const values = [];
      let conditions = [];

      if (where) {
        if (where.id) {
          conditions.push(`"id" = $${values.length + 1}`);
          values.push(where.id);
        }
      }

      // First delete all messages in the conversation
      await pool.query('DELETE FROM "Message" WHERE "conversationId" = $1', [
        where.id,
      ]);

      // Then delete the conversation
      const query = `DELETE FROM "Conversation" WHERE ${conditions.join(" AND ")} RETURNING *`;
      const result = await pool.query(query, values);
      return result.rows[0];
    },

    deleteMany: async (options) => {
      const { where } = options;
      const values = [];
      let conditions = [];

      if (where) {
        if (where.userId) {
          conditions.push(`"userId" = $${values.length + 1}`);
          values.push(where.userId);
        }
      }

      // First get all conversation IDs to delete their messages
      const convQuery = `SELECT id FROM "Conversation" WHERE ${conditions.join(" AND ")}`;
      const convResult = await pool.query(convQuery, values);
      const convIds = convResult.rows.map((r) => r.id);

      // Delete messages for all conversations
      if (convIds.length > 0) {
        const placeholders = convIds.map((_, i) => `$${i + 1}`).join(", ");
        await pool.query(
          `DELETE FROM "Message" WHERE "conversationId" IN (${placeholders})`,
          convIds,
        );
      }

      // Delete conversations
      const query = `DELETE FROM "Conversation" WHERE ${conditions.join(" AND ")}`;
      const result = await pool.query(query, values);
      return { count: result.rowCount };
    },
  },

  message: {
    findMany: async (options) => {
      const { where, orderBy } = options || {};
      let query = 'SELECT * FROM "Message"';
      const values = [];
      let conditions = [];

      if (where) {
        if (where.conversationId) {
          conditions.push('"conversationId" = $' + (values.length + 1));
          values.push(where.conversationId);
        }
      }

      if (conditions.length > 0) {
        query += " WHERE " + conditions.join(" AND ");
      }

      if (orderBy) {
        if (orderBy.createdAt === "asc") {
          query += ' ORDER BY "createdAt" ASC';
        } else if (orderBy.createdAt === "desc") {
          query += ' ORDER BY "createdAt" DESC';
        }
      }

      const result = await pool.query(query, values);
      return result.rows;
    },

    create: async (options) => {
      const { data } = options;

      // Generate a unique ID if not provided
      const id =
        data.id ||
        `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const now = new Date();

      const insertData = {
        id,
        conversationId: data.conversationId,
        content: data.content,
        role: data.role,
        createdAt: now,
      };

      const fields = Object.keys(insertData);
      const values = Object.values(insertData);
      const placeholders = fields.map((_, i) => "$" + (i + 1));

      const query = `INSERT INTO "Message" (${fields.map((f) => `"${f}"`).join(", ")}) VALUES (${placeholders.join(", ")}) RETURNING *`;

      const result = await pool.query(query, values);
      return result.rows[0];
    },

    createMany: async (options) => {
      const { data } = options;
      let count = 0;

      for (const msg of data) {
        const id =
          msg.id ||
          `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}_${count}`;
        const now = new Date();

        const insertData = {
          id,
          conversationId: msg.conversationId,
          content: msg.content,
          role: msg.role,
          createdAt: now,
        };

        const fields = Object.keys(insertData);
        const values = Object.values(insertData);
        const placeholders = fields.map((_, i) => "$" + (i + 1));

        const query = `INSERT INTO "Message" (${fields.map((f) => `"${f}"`).join(", ")}) VALUES (${placeholders.join(", ")})`;
        await pool.query(query, values);
        count++;
      }

      return { count };
    },

    count: async (options) => {
      const { where } = options || {};
      let query = 'SELECT COUNT(*) FROM "Message"';
      const values = [];
      let conditions = [];

      if (where) {
        if (where.conversationId) {
          conditions.push('"conversationId" = $' + (values.length + 1));
          values.push(where.conversationId);
        }
      }

      if (conditions.length > 0) {
        query += " WHERE " + conditions.join(" AND ");
      }

      const result = await pool.query(query, values);
      return parseInt(result.rows[0].count);
    },
  },
};

export default db;
