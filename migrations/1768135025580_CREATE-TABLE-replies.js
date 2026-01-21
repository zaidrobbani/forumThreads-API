/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
    pgm.createTable('replies', {
        id: {
            type: 'TEXT',
            notNull: true,
            primaryKey: true,
        },
        comment_id: {
            type: 'TEXT',
            notNull: true,
        },
        content: {
            type: 'TEXT',
            notNull: true,
        },
        owner: {
            type: 'TEXT',
            notNull: true,
        },
        date: {
            type: 'TIMESTAMP',
            notNull: true,
            default: pgm.func('CURRENT_TIMESTAMP'),
        },
        is_delete: {
            type: 'BOOLEAN',
            notNull: true,
            default: false,
        }
    });

    pgm.addConstraint('replies', 'fk_replies_comment_id_comments_id', {
        foreignKeys: {
            columns: 'comment_id',
            references: 'comments(id)',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        }   
    });

    pgm.addConstraint('replies', 'fk_replies_owner_users_id', {
        foreignKeys: {
            columns: 'owner',
            references: 'users(id)',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        }   
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable('replies', { ifExists: true });
};
