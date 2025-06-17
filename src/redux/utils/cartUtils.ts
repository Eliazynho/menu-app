/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// utils/cartUtils.ts

import { CartItem } from "@/types";
import { AdditionalCategory, AdditionalOption } from "@/types"; // Importe os tipos necessários

// Sua função flattenAdditionals original que retorna um array de AdditionalOption[]
// Útil para listar todos os adicionais, por exemplo.
export const flattenAdditionals = (
  categories: AdditionalCategory[]
): AdditionalOption[] => {
  if (!categories) {
    return [];
  }
  return categories.flatMap((category) =>
    category.additional_options.map((option) => ({
      ...option,
      categoryName: category.name, // Adiciona o nome da categoria ao adicional
    }))
  );
};

// NOVA FUNÇÃO: Cria um mapa (objeto) de adicionais, usando o ID como chave.
// Ideal para buscar rapidamente um adicional pelo seu ID.
export const createAdditionalsMap = (
  categories: AdditionalCategory[]
): Record<string, AdditionalOption> => {
  const additionalMap: Record<string, AdditionalOption> = {};

  if (!categories) {
    return additionalMap;
  }

  categories.forEach((category) => {
    category.additional_options.forEach((option) => {
      // Mapeia o additionalOption pelo seu ID
      additionalMap[option.id] = option;
    });
  });

  return additionalMap;
};

// Calcula o preço total dos adicionais selecionados para um item.
// Usa o mapa para buscar os preços de forma eficiente.
export const calculateAdditionalPrice = (
  additionalOptions: Record<string, number>,
  categories: AdditionalCategory[] // Ainda recebe categorias para criar o mapa
): number => {
  const additionalMap = createAdditionalsMap(categories); // Cria o mapa aqui

  return Object.entries(additionalOptions || {}).reduce(
    (total, [additionalId, quantity]) => {
      const additional = additionalMap[additionalId]; // Acesso direto ao adicional pelo ID
      if (additional) {
        return total + additional.price * quantity;
      }
      // Se o adicional não for encontrado no mapa (pode acontecer se os dados mudarem),
      // apenas ignora ou lida com o erro se necessário.
      return total;
    },
    0
  );
};

// Calcula o preço total de um único item no carrinho (produto + adicionais)
export const calculateItemPrice = (
  item: CartItem,
  categories: AdditionalCategory[] // Ainda recebe categorias para calcular adicionais
): number => {
  const productPrice = item.product.price;
  // Reutiliza a função que calcula o preço dos adicionais usando o mapa
  const additionalPrice = calculateAdditionalPrice(
    item.additionalOptions || {},
    categories
  );
  return (productPrice + additionalPrice) * item.quantity;
};

// Calcula o preço total de todos os itens no carrinho
export const calculateCartTotal = (
  cartItems: CartItem[],
  categories: AdditionalCategory[] // Ainda recebe categorias para calcular o total de cada item
): number => {
  return cartItems.reduce((total, item) => {
    // Reutiliza a função que calcula o preço de cada item
    return total + calculateItemPrice(item, categories);
  }, 0);
};

// Formata a lista de adicionais selecionados para exibição (ex: "Com: Queijo extra, Bacon")
// Usa o mapa para buscar os nomes de forma eficiente.
export const formatAdditionalOptions = (
  additionalOptions: Record<string, number>,
  categories: AdditionalCategory[] // Ainda recebe categorias para criar o mapa
): string => {
  const additionalMap = createAdditionalsMap(categories); // Cria o mapa aqui

  const selectedAdditionals = Object.entries(additionalOptions || {})
    .filter(([_, quantity]) => quantity > 0) // Filtra adicionais com quantidade > 0
    .map(([additionalId, quantity]) => {
      const additional = additionalMap[additionalId]; // Acesso direto ao adicional pelo ID
      if (additional) {
        // Formata a string, incluindo a quantidade se for mais de 1
        return quantity > 1
          ? `${quantity}x ${additional.name}`
          : additional.name;
      }
      return ""; // Retorna string vazia se o adicional não for encontrado
    })
    .filter(Boolean); // Remove quaisquer strings vazias resultantes de adicionais não encontrados

  // Retorna a string formatada ou vazia se não houver adicionais selecionados
  return selectedAdditionals.length > 0
    ? `Com: ${selectedAdditionals.join(", ")}`
    : "";
};

// Função para encontrar um adicional específico por ID.
// Usa o mapa para buscar o adicional de forma eficiente.
export const findAdditionalById = (
  additionalId: string,
  categories: AdditionalCategory[] // Ainda recebe categorias para criar o mapa
): AdditionalOption | undefined => {
  const additionalMap = createAdditionalsMap(categories); // Cria o mapa aqui
  return additionalMap[additionalId]; // Acesso direto ao adicional pelo ID
};

// Função para agrupar adicionais por categoria (útil para exibir na modal de produto)
// Esta função não precisa do mapa, pois já trabalha com a estrutura agrupada.
export const getAdditionalsByCategory = (categories: AdditionalCategory[]) => {
  if (!categories) {
    return [];
  }
  return categories.map((category) => ({
    category: category.name,
    categoryId: category.id,
    additionals: category.additional_options, // Usa a lista de additional_options diretamente
  }));
};
