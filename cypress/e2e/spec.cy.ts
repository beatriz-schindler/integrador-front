describe('Acessar o Easynote', () => {
  beforeEach(() => {
      cy.visit('/')
      cy.get('input[name="usuario"]').type('Admin');
      cy.get('input[name="senha"]').type('admin');
      cy.contains('button', 'Entrar').click();
    })


  it('Realizar um empréstimo corretamente',() =>{
      cy.contains('a', 'Empréstimos').click();
      cy.get('input[name="ra"]').type('505233');
      cy.focused().blur();
      cy.get('input[name="patrimonio"]').type('NB004');
      cy.focused().blur();
      cy.get('input[name="observacao"]').type('Ok');
      cy.wait(1000);
      cy.contains('button', 'Iniciar Empréstimo').click();
  })

  it('Finalizar um empréstimo corretamente',() =>{
      cy.contains('a', 'Empréstimos').click();
      cy.get('input[name="patrimonio"]').type('NB004');
      cy.focused().blur();
      cy.wait(1000);
      cy.contains('button', 'Encerrar Empréstimo').click();
  })

})