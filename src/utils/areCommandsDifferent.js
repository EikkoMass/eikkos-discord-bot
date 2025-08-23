import {ApplicationCommandOptionType} from 'discord.js';

export default (existingCommand, localCommand) => {
  const areChoicesDifferent = (existingChoices, localChoices) => {
    for (const localChoice of localChoices) {
      const existingChoice = existingChoices?.find(
        (choice) => choice.name === localChoice.name
      );

      if (!existingChoice) {
        return true;
      }

      if (localChoice.value !== existingChoice.value) {
        return true;
      }
    }
    return false;
  };

  const areOptionsDifferent = (existingOptions, localOptions) => {
    for (const localOption of localOptions) {
      const existingOption = existingOptions?.find(
        (option) => option.name === localOption.name
      );

      if (!existingOption) {
        return true;
      }
      
      /* Subcomandos e grupos de Subcomandos sao obrigatorios por padrao, entao sempre e salvo como undefined */
      const isRequiredDifferent = 
        localOption.type !== ApplicationCommandOptionType.SubcommandGroup 
        && localOption.type !== ApplicationCommandOptionType.Subcommand 
        && (localOption.required || false) !== existingOption.required;

      if (
        localOption.description !== existingOption.description ||
        localOption.type !== existingOption.type ||
        isRequiredDifferent ||
        (localOption.choices?.length || 0) !== (existingOption.choices?.length || 0) ||
        areChoicesDifferent(localOption.choices || [], existingOption.choices || [])
      ) {
        return true;
      }
    }
    return false;
  };
  
  return existingCommand.description !== localCommand.description ||
    existingCommand.options?.length !== (localCommand.options?.length || 0) ||
    areOptionsDifferent(existingCommand.options, localCommand.options || []);
};