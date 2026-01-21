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
    pgm.createTable('threads', {
        id: {
            type: 'TEXT',
            notNull: true,
            primaryKey: true,
        },
        title: {
            type: 'TEXT',
            notNull: true,
        },
        body: {
            type: 'TEXT',
            notNull: true,
        },
        owner: {
            type: 'TEXT',
            notNull: true,
        },
        date: {
            type: "TIMESTAMP",
            notNull: true,
            default: pgm.func('CURRENT_TIMESTAMP'),
        },
    })

    pgm.addConstraint('threads', 'fk_threads_owner_users_id', {
        foreignKeys: {
            columns: 'owner',
            references: 'users(id)',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        }
    })
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable('threads', { ifExists: true });
};
