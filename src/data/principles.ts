import type { ImprovPrinciple } from '../types';

export const IMPROV_PRINCIPLES: ImprovPrinciple[] = [
  // Foundation
  { id: 'yes_and',              nameKey: 'principles.items.yes_and.name',              textKey: 'principles.items.yes_and.text',              exampleKey: 'principles.items.yes_and.example',   category: 'foundation' },
  { id: 'make_partner_look_good', nameKey: 'principles.items.make_partner_look_good.name', textKey: 'principles.items.make_partner_look_good.text', category: 'foundation' },
  { id: 'listen',               nameKey: 'principles.items.listen.name',               textKey: 'principles.items.listen.text',               category: 'foundation' },
  { id: 'trust',                nameKey: 'principles.items.trust.name',                textKey: 'principles.items.trust.text',                category: 'foundation' },
  { id: 'commit',               nameKey: 'principles.items.commit.name',               textKey: 'principles.items.commit.text',               category: 'foundation' },
  { id: 'dont_try_funny',       nameKey: 'principles.items.dont_try_funny.name',       textKey: 'principles.items.dont_try_funny.text',       category: 'foundation' },
  { id: 'be_present',           nameKey: 'principles.items.be_present.name',           textKey: 'principles.items.be_present.text',           category: 'foundation' },
  { id: 'mistakes_gifts',       nameKey: 'principles.items.mistakes_gifts.name',       textKey: 'principles.items.mistakes_gifts.text',       category: 'foundation' },
  { id: 'be_obvious',           nameKey: 'principles.items.be_obvious.name',           textKey: 'principles.items.be_obvious.text',           category: 'foundation' },
  { id: 'support_team',         nameKey: 'principles.items.support_team.name',         textKey: 'principles.items.support_team.text',         category: 'foundation' },
  // Character
  { id: 'point_of_view',        nameKey: 'principles.items.point_of_view.name',        textKey: 'principles.items.point_of_view.text',        category: 'character' },
  { id: 'pursue_want',          nameKey: 'principles.items.pursue_want.name',          textKey: 'principles.items.pursue_want.text',          category: 'character' },
  { id: 'react_specifically',   nameKey: 'principles.items.react_specifically.name',   textKey: 'principles.items.react_specifically.text',   category: 'character' },
  { id: 'use_body',             nameKey: 'principles.items.use_body.name',             textKey: 'principles.items.use_body.text',             category: 'character' },
  { id: 'status_everything',    nameKey: 'principles.items.status_everything.name',    textKey: 'principles.items.status_everything.text',    category: 'character' },
  { id: 'play_emotions',        nameKey: 'principles.items.play_emotions.name',        textKey: 'principles.items.play_emotions.text',        category: 'character' },
  { id: 'relationships_define', nameKey: 'principles.items.relationships_define.name', textKey: 'principles.items.relationships_define.text', category: 'character' },
  // Status
  { id: 'status_relative',      nameKey: 'principles.items.status_relative.name',      textKey: 'principles.items.status_relative.text',      category: 'status' },
  { id: 'status_shifts',        nameKey: 'principles.items.status_shifts.name',        textKey: 'principles.items.status_shifts.text',        category: 'status' },
  { id: 'low_status_fun',       nameKey: 'principles.items.low_status_fun.name',       textKey: 'principles.items.low_status_fun.text',       category: 'status' },
  { id: 'status_in_body',       nameKey: 'principles.items.status_in_body.name',       textKey: 'principles.items.status_in_body.text',       category: 'status' },
  // Editing
  { id: 'edit_at_height',       nameKey: 'principles.items.edit_at_height.name',       textKey: 'principles.items.edit_at_height.text',       category: 'editing' },
  { id: 'sweep_momentum',       nameKey: 'principles.items.sweep_momentum.name',       textKey: 'principles.items.sweep_momentum.text',       category: 'editing' },
  { id: 'callbacks_reward',     nameKey: 'principles.items.callbacks_reward.name',     textKey: 'principles.items.callbacks_reward.text',     category: 'editing' },
  { id: 'end_scenes',           nameKey: 'principles.items.end_scenes.name',           textKey: 'principles.items.end_scenes.text',           category: 'editing' },
  { id: 'dont_over_edit',       nameKey: 'principles.items.dont_over_edit.name',       textKey: 'principles.items.dont_over_edit.text',       category: 'editing' },
  // Ensemble
  { id: 'follow_follower',      nameKey: 'principles.items.follow_follower.name',      textKey: 'principles.items.follow_follower.text',      category: 'ensemble' },
  { id: 'give_take',            nameKey: 'principles.items.give_take.name',            textKey: 'principles.items.give_take.text',            category: 'ensemble' },
  { id: 'group_mind',           nameKey: 'principles.items.group_mind.name',           textKey: 'principles.items.group_mind.text',           category: 'ensemble' },
  { id: 'take_care',            nameKey: 'principles.items.take_care.name',            textKey: 'principles.items.take_care.text',            category: 'ensemble' },
  { id: 'agree_loud',           nameKey: 'principles.items.agree_loud.name',           textKey: 'principles.items.agree_loud.text',           category: 'ensemble' },
  { id: 'support_initiations',  nameKey: 'principles.items.support_initiations.name',  textKey: 'principles.items.support_initiations.text',  category: 'ensemble' },
  // Stage Craft
  { id: 'use_whole_stage',      nameKey: 'principles.items.use_whole_stage.name',      textKey: 'principles.items.use_whole_stage.text',      category: 'stagecraft' },
  { id: 'share_scene',          nameKey: 'principles.items.share_scene.name',          textKey: 'principles.items.share_scene.text',          category: 'stagecraft' },
  { id: 'second_beats',         nameKey: 'principles.items.second_beats.name',         textKey: 'principles.items.second_beats.text',         category: 'stagecraft' },
  { id: 'silence_funny',        nameKey: 'principles.items.silence_funny.name',        textKey: 'principles.items.silence_funny.text',        category: 'stagecraft' },
  { id: 'simple_agreements',    nameKey: 'principles.items.simple_agreements.name',    textKey: 'principles.items.simple_agreements.text',    category: 'stagecraft' },
  { id: 'strong_offers',        nameKey: 'principles.items.strong_offers.name',        textKey: 'principles.items.strong_offers.text',        category: 'stagecraft' },
  { id: 'label_relationship',   nameKey: 'principles.items.label_relationship.name',   textKey: 'principles.items.label_relationship.text',   category: 'stagecraft' },
  { id: 'justify',              nameKey: 'principles.items.justify.name',              textKey: 'principles.items.justify.text',              category: 'stagecraft' },
  { id: 'heighten_explore',     nameKey: 'principles.items.heighten_explore.name',     textKey: 'principles.items.heighten_explore.text',     category: 'stagecraft' },
  { id: 'find_game',            nameKey: 'principles.items.find_game.name',            textKey: 'principles.items.find_game.text',            category: 'stagecraft' },
];
