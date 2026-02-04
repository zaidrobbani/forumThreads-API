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
    pgm.createTable('user_comment_likes', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
            notNull: true,
        },
        user_id: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        comment_id: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        date: {
            type: 'TIMESTAMP',
            notNull: true,
            default: pgm.func('CURRENT_TIMESTAMP'),
        }
    }, {ifNotExists: true});

    pgm.addConstraint('user_comment_likes', 'fk_user_comment_likes_user_id_users_id', {
        foreignKeys: {
            columns: 'user_id',
            references: 'users(id)',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        }   
    }, {ifNotExists: true});

    pgm.addConstraint('user_comment_likes', 'fk_user_comment_likes_comment_id_comments_id', {
        foreignKeys: {
            columns: 'comment_id',
            references: 'comments(id)',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        }   
    }, {ifNotExists: true});

    pgm.addConstraint('user_comment_likes', 'unique_user_comment_like', {
        unique: ['user_id', 'comment_id'],
    }, {ifNotExists: true});
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable('user_comment_likes', {ifExists: true});
};
