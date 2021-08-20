// @flow
import * as React from 'react';
import type { UserPayload } from 'generated/graphql';
import { StringValue } from 'react-values';
import { Mutation } from 'react-apollo';
import { useQuery } from '@apollo/react-hooks';
import { FormattedMessage } from 'react-intl';
import { clone } from 'ramda';
import { MentionsInput, Mention } from 'react-mentions';
import type { DocumentNode } from 'graphql/language/ast';
import UserAvatar from 'components/UserAvatar';
import { messagePreferencesQuery } from 'modules/timeline/query';
import { DefaultStyle, TextAreaInput } from 'components/Form/Inputs';
import Icon from 'components/Icon';
import { commentCreateMutation } from 'modules/timeline/mutation';
import messages from 'modules/timeline/messages';
import SubmitMenu from 'modules/timeline/components/CommentInput/submitMenu';
import {
  ButtonStyle,
  HeaderWrapperStyle,
  InputWrapperStyle,
  TitleStyle,
  MentionsInputStyle,
  MentionStyle,
  SuggestionListStyle,
  MentionSuggestionStyle,
  MentionSuggestionNameWrapperStyle,
  MentionNameStyle,
  MentionCompanyStyle,
  MessageButtonWrapper,
} from './style';

type Props = {|
  entity: Object,
  query: DocumentNode,
  queryField: string,
  variables: Object,
  users: Array<UserPayload>,
  onCompleted: () => void,
|};

const CommentInput = ({ entity, query, queryField, variables, onCompleted, users }: Props) => {
  const [focused, setFocused] = React.useState(false);
  const [sendType, setSendType] = React.useState(false);

  const mentionInputRef = React.useRef(null);

  const { data: messageData, refetch } = useQuery(messagePreferencesQuery, {
    onCompleted: () => {
      setSendType(messageData?.viewer?.messagePreferences?.sendMessageByEnter);
    },
  });

  return (
    <StringValue>
      {({ value, set }) => (
        <Mutation
          mutation={commentCreateMutation}
          update={(store, result) => {
            const createdComment = result && result.data && result.data.commentCreate;
            const data = clone(store.readQuery({ query, variables }));

            if (data && data[queryField]) {
              data[queryField].timeline.entries.nodes.unshift(createdComment);
            }

            store.writeQuery({ query, data, variables });
          }}
          onCompleted={() => {
            set('');
            onCompleted();
          }}
        >
          {(commentCreate, { loading }) => {
            const submit = () => {
              const content = value.trim();
              if (content === '') {
                return;
              }

              commentCreate({
                variables: {
                  input: {
                    content,
                    entity,
                  },
                },
              });
            };

            return (
              <div className={InputWrapperStyle}>
                <div className={HeaderWrapperStyle}>
                  <span className={TitleStyle}>
                    <FormattedMessage {...messages.message} />
                  </span>
                  <div className={MessageButtonWrapper}>
                    <SubmitMenu sendType={sendType} refetch={refetch}>
                      <button className={ButtonStyle} type="button" disabled={loading}>
                        <Icon icon="HORIZONTAL_ELLIPSIS" />
                      </button>
                    </SubmitMenu>
                    <button
                      className={ButtonStyle}
                      type="button"
                      disabled={loading}
                      onClick={() => submit()}
                    >
                      <Icon icon="PAPER_PLANE" />
                    </button>
                  </div>
                </div>
                <DefaultStyle
                  type="textarea"
                  isFocused={focused}
                  disabled={loading}
                  forceHoverStyle
                  height="90px"
                >
                  {users.length > 0 ? (
                    <>
                      <div ref={mentionInputRef} className={SuggestionListStyle} />
                      <MentionsInput
                        className={MentionsInputStyle}
                        value={value}
                        suggestionsPortalHost={mentionInputRef.current}
                        onChange={e => set(e.target.value)}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        onKeyDown={e => {
                          e.stopPropagation();
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            submit();
                          }
                        }}
                      >
                        <Mention
                          className={MentionStyle}
                          data={users.map(user => ({
                            ...user,
                            display: `${user.firstName} ${user.lastName}`,
                          }))}
                          trigger="@"
                          markup="@[__display__](__id__)"
                          renderSuggestion={(
                            suggestion,
                            search,
                            highlightedDisplay,
                            index,
                            isFocused
                          ) => (
                            <div className={MentionSuggestionStyle(isFocused)}>
                              <UserAvatar
                                firstName={suggestion.firstName}
                                lastName={suggestion.lastName}
                                showBothInitials
                                width="25px"
                                height="25px"
                              />

                              <div className={MentionSuggestionNameWrapperStyle}>
                                <div className={MentionNameStyle}>{highlightedDisplay}</div>
                                <div className={MentionCompanyStyle}>
                                  {suggestion.organization.name}
                                </div>
                              </div>
                            </div>
                          )}
                        />
                      </MentionsInput>
                    </>
                  ) : (
                    <TextAreaInput
                      align="left"
                      name="content"
                      value={value}
                      onChange={e => set(e.target.value)}
                      onFocus={() => setFocused(true)}
                      onBlur={() => setFocused(false)}
                      onKeyDown={e => {
                        e.stopPropagation();
                        if (sendType) {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            submit();
                          }
                        } else if (e.keyCode === 13 && (e.metaKey || e.ctrlKey)) {
                          e.preventDefault();
                          submit();
                        }
                      }}
                    />
                  )}
                </DefaultStyle>
              </div>
            );
          }}
        </Mutation>
      )}
    </StringValue>
  );
};

export default CommentInput;
