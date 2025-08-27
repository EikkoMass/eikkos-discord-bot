import {ApplicationCommandOptionType} from 'discord.js';

export default (existingCommand, localCommand) => {
  
  return existingCommand.description !== localCommand.description ||
    existingCommand.options?.length !== (localCommand.options?.length || 0) ||
    areOptionsDifferent(existingCommand.options, localCommand.options || []);
};

function areOptionsDifferent(existingOptions, localOptions) {
    for (const localOption of localOptions) {
      
      const existingOption = existingOptions?.find(option => option.name === localOption.name);

      if (!existingOption || localOption.type !== existingOption.type) return true;
      
      if(
        isSubcommand(localOption) &&
        (localOption.required || false) !== existingOption.required &&
        areOptionsDifferent(existingOption.options || [], localOption.options || [])
      )
      {
        return true;
      }
      
      if (
        localOption.description !== existingOption.description ||
        (localOption.choices?.length || 0) !== (existingOption.choices?.length || 0) ||
        areChoicesDifferent(localOption.choices || [], existingOption.choices || [])
      ) {
        return true;
      }
    }
    return false;
  };

function isSubcommand(option)
{
  return option.type === ApplicationCommandOptionType.SubcommandGroup || option.type === ApplicationCommandOptionType.Subcommand;
}

function areChoicesDifferent (existingChoices, localChoices) {
  for (const localChoice of localChoices) {

    const existingChoice = existingChoices?.find(choice => choice.name === localChoice.name);

    if (!existingChoice) {
      return true;
    }

    if (localChoice.value !== existingChoice.value) {
      return true;
    }
  }
  return false;
};