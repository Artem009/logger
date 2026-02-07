import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddAdviceColumnToErrors1739030400000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'errors',
      new TableColumn({
        name: 'advice',
        type: 'text',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('errors', 'advice');
  }
}
