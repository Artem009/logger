import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateActorsAndJoinTable1738944000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'actors',
        columns: [
          {
            name: 'id',
            type: 'serial',
            isPrimary: true,
          },
          {
            name: 'type',
            type: 'varchar',
          },
          {
            name: 'name',
            type: 'varchar',
          },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'errors_actors',
        columns: [
          {
            name: 'error_id',
            type: 'uuid',
          },
          {
            name: 'actor_id',
            type: 'int',
          },
        ],
      }),
      true,
    );

    await queryRunner.createPrimaryKey('errors_actors', ['error_id', 'actor_id']);

    await queryRunner.createForeignKey(
      'errors_actors',
      new TableForeignKey({
        columnNames: ['error_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'errors',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'errors_actors',
      new TableForeignKey({
        columnNames: ['actor_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'actors',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('errors_actors');
    if (table) {
      const foreignKeys = table.foreignKeys;
      for (const fk of foreignKeys) {
        await queryRunner.dropForeignKey('errors_actors', fk);
      }
    }
    await queryRunner.dropTable('errors_actors');
    await queryRunner.dropTable('actors');
  }
}
