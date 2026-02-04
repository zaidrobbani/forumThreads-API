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
    pgm.createTable('comments', {
        id: {
            type: 'TEXT',
            primaryKey: true,
            notNull: true,
        },
        thread_id: {
            type: 'TEXT',
            notNull: true,
        },
        owner: {
            type: 'TEXT',
            notNull: true,
        },
        content: {
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
    }, {ifNotExists: true});

    pgm.addConstraint('comments', 'fk_comments_thread_id_threads_id', {
        foreignKeys: {
            columns: 'thread_id',
            references: 'threads(id)',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        }
    }, {ifNotExists: true});

    pgm.addConstraint('comments', 'fk_comments_owner_users_id', {
        foreignKeys: {
            columns: 'owner',
            references: 'users(id)',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        }
    }, {ifNotExists: true});
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable('comments', { ifExists: true });
};
