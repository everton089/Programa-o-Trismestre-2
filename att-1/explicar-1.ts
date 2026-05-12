import todo from "./core.ts"; // importa o core.ts para usar as funções crisdas nele.

const server = Bun.serve({ // cria o servidor 
  port: 3000, //configura ele para a porta 3000

  routes: { // começa a difinir as rotas do servidor
    "/": new Response(Bun.file("./public/index.html")),//define para que quando ao usuario não coloque nada apos a '/' ele vai para na pagina public

    "/api/todo": { // define a rota para os recursos de todo
      GET: async () => { //define o medoto GET para a rota de forma assíncrona
        const items = await todo.getItems() // cria a variavel items que recebe uma promesa da função getItems do core.ts, que retorna a lista de itens do todo
        return Response.json(items) //retorna a resposta da função getItmes como um json
      },

      POST: async (req) => { //define o medoto POST para a rota de forma assíncrona
        const data = await req.json() as any; //cria a variavel data que recebe uma promessa de resposta do corpo da requisição, convertida em json para json e tipada como any
        const item = data.item || null;// cria a variavel item que recebe o valor da chave item do json recebido ou null caso a chave não exista
        if (!item)// verifica se a varivel item existe
          return Response.json('Por favor, forneça um item para adicionar.', { status: 400 }); // se não existir, retorna, no formato json, uma mensagem de erro e o status 400 (bad request)
        await todo.addItem(item);// promesa de chamamento da funçãos addItms passadoo o item recebido para adicionar a lista de itens do todo
        return Response.json(data);// retorna o json recebido como resposta da requisição, confirmando que o item foi adicionado
      },
    },

    "/api/todo/:index": { // define a rote para recursos todo com parametor index
      PUT: async (req) => { // define o metodo PUT da rota de forma assíncrona
        const index = parseInt(req.params.index); // cria a variavel index,que recebe o index do parametro da rota, convertido para inteiro usando parseInt
        if (isNaN(index)) // verifica se é um numero inteiro valido
          return Response.json('Índice inválido. um número inteiro é esperado.', { status: 400 });// se for invalido le retorna um eroo 400
        const data = await req.json() as any; // se for valido, cria a variavel data que recebe uma promessa de resposta da requisição em json
        const newItem = data.newItem || null;// o newItem recebe o valor de data na chave newitem ou null caso a chave não exista
        if (!newItem) // verifica se o newItem existe
          return Response.json('Por favor, forneça um novo item para atualizar.', { status: 400 }); // se não existir retorna u7m eroo 400
        try { // tentativa de execução do bloco de código abaixo
          await todo.updateItem(index, newItem); // prmesa de chamando da função updadeItem no todo, passa o newItm e o index como parametros para atualizar o item no index especificado
          return Response.json(`Item no índice ${index} atualizado para "${newItem}".`);// se o item for atualzado retor uma messagem de sucesso
        } catch (error: any) {// caso tenha um erro
          return Response.json(error.message, { status: 400 });// retorna mensagem de eroo 400
        }
      },

      DELETE: async (req) => { // define o motodo DELETE da rota de forma assíncrona
        const index = parseInt(req.params.index); // cria a variavel index que recebe o index do parametor, tranformado para inteiro
        if (isNaN(index)) // verifica se e um numero valido
          return Response.json('Índice inválido.', { status: 400 }); // se nao for valido retorna um eroo 400
        try { //tenta exucutar o bloco
          await todo.removeItem(index); // promesa de chamamento da função removeItem do todo, passando o index como parametro para remover o item no index especificado
          return Response.json(`Item no índice ${index} removido com sucesso.`);// se o item for removido com sucesso retorna uma mensagem de sucesso
        } catch (error: any) { // caso tenha um erro
          return Response.json(error.message, { status: 400 });// retorna a mensagem de erro com status 400
        }
      },
    },

    // EXEMPLO BÁSICO

    "/api/exemplo": {// define a rota para o exemplo
      GET: () => { // define o medoto GET da rota
        return new Response(`Esse é o exemplo: ${Date.now()}`)//retorna uma resposta contendo a date atual
      },

      POST: async (req) => {// define o metodo POST da rota de forma assíncrona
        const data = await req.json() as any; // cria a variavel data que recebe uma promessa de resposta do corpo da requisição, convertida em json
        data.recebidoEm = new Date().toLocaleDateString("pt-BR"); // adiciona uma nova chave ao json recebido, chamada recebidoEm, que recebe a data atual 
        return Response.json(data);// retorna o json recebido, agora com a nova chave, como resposta da requisição
      },
    },

    "/api/exemplo/:id": { // define a rota para o exemplo com um parâmetro de rota chamado id
      PUT: async (req, params) => { // define o metodo PUT da rota de forma assíncrona
        const { id } = req.params;//    cria a variavel id que recebe o valor do parametro de rota id
        const data = await req.json() as any; // cria a variavel data que recebe uma promessa de resposta do corpo da requisição, convertida em json
        data.id = id;// adiciona uma nova chave ao json recebido, chamada id, que recebe o valor do parametro de rota id
        data.recebidoEm = new Date().toLocaleDateString("pt-BR");// adiciona uma nova chave ao json recebido, chamada recebidoEm, que recebe a data atual
        return Response.json(data);// retorna o json recebido, agora com as novas chaves, como resposta da requisição
      },

      PATCH: async (req, params) => {// define o metodo PATCH da rota de forma assíncrona
        const { id } = req.params;// cria a variavel id que recebe o valor do parametro de rota id
        const data = await req.json() as any;// cria a variavel data que recebe uma promessa de resposta do corpo da requisição, convertida em json
        data.chavesAtualizadas = Object.keys(data);// adiciona uma nova chave ao json recebido, chamada chavesAtualizadas, que recebe um array com as chaves do json recebido
        data.id = id;// adiciona uma nova chave ao json recebido, chamada id, que recebe o valor do parametro de rota id
        data.atualizadoEm = new Date().toLocaleDateString("pt-BR");// adiciona uma nova chave ao json recebido, chamada atualizadoEm, que recebe a data atual
        return Response.json(data);// retorna o json recebido, agora com as novas chaves, como resposta da requisição
      },

      DELETE: (req, params) => {// define o metodo DELETE da rota
        const { id } = req.params;// cria a variavel id que recebe o valor do parametro de rota id
        return new Response(`Recurso com id ${id} deletado`, { status: 200 });// retorna uma resposta com uma mensagem de sucesso e status 200 (OK)
      }
    }
    // FIM DO EXEMPLO BÁSICO
  },

  async fetch(req) {// define a função fetch para lidar com requisições que não correspondem a nenhuma rota definida
    return new Response(`Not Found`, { status: 404 });// retorna uma resposta com a mensagem "Not Found" e status 404 (Not Found)
  },
});

console.log(`Server running at http://localhost:${server.port}`);// exibe uma mensagem no console indicando que o servidor está rodando e em qual porta ele está ouvindo